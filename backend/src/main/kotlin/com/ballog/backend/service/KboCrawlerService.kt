package com.ballog.backend.service

import com.ballog.backend.dto.NaverGameDto
import com.ballog.backend.dto.NaverScheduleResponse
import com.ballog.backend.entity.Game
import com.ballog.backend.entity.GameStatus
import com.ballog.backend.entity.Team
import com.ballog.backend.repository.GameRepository
import com.ballog.backend.repository.StadiumRepository
import com.ballog.backend.repository.TeamRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestClient
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import org.springframework.scheduling.annotation.Async

@Service
class KboCrawlerService(
    private val gameRepository: GameRepository,
    private val teamRepository: TeamRepository,
    private val stadiumRepository: StadiumRepository,
    restClientBuilder: RestClient.Builder
) {
    private val logger = LoggerFactory.getLogger(javaClass)
    private val restClient = restClientBuilder
        .baseUrl("https://api-gw.sports.naver.com")
        .defaultHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        .defaultHeader("Referer", "https://sports.news.naver.com/kbo/schedule/index")
        .defaultHeader("Accept", "application/json, text/plain, */*")
        .build()

    private val emitters = java.util.concurrent.CopyOnWriteArrayList<org.springframework.web.servlet.mvc.method.annotation.SseEmitter>()

    fun subscribe(): org.springframework.web.servlet.mvc.method.annotation.SseEmitter {
        val emitter = org.springframework.web.servlet.mvc.method.annotation.SseEmitter(300_000L) // 5 min timeout
        this.emitters.add(emitter)
        
        emitter.onCompletion { this.emitters.remove(emitter) }
        emitter.onTimeout { this.emitters.remove(emitter) }
        
        return emitter
    }

    private fun broadcastProgress(message: String, percent: Int) {
        val event = mapOf("message" to message, "percent" to percent)
        val deadEmitters = mutableListOf<org.springframework.web.servlet.mvc.method.annotation.SseEmitter>()
        
        this.emitters.forEach { emitter ->
            try {
                emitter.send(org.springframework.web.servlet.mvc.method.annotation.SseEmitter.event().name("progress").data(event))
            } catch (e: Exception) {
                deadEmitters.add(emitter)
            }
        }
        this.emitters.removeAll(deadEmitters)
    }

    @Async
    @Transactional
    fun crawlSchedule(startDate: LocalDate, endDate: LocalDate) {
        logger.info("Starting KBO schedule crawl from $startDate to $endDate")
        broadcastProgress("Starting crawl...", 0)
        
        val totalDays = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1
        var daysProcessed = 0L
        
        var currentStart = startDate
        while (!currentStart.isAfter(endDate)) {
            // Crawl day by day to avoid limit (Naver returns max ~10 items)
            val currentEnd = currentStart // Start = End (1 day)
            
            crawlRange(currentStart, currentEnd)
            
            daysProcessed++
            val percent = ((daysProcessed.toDouble() / totalDays) * 100).toInt()
            broadcastProgress("Processed $daysProcessed / $totalDays days", percent)
            
            currentStart = currentEnd.plusDays(1)
        }
        
        broadcastProgress("Crawl completed!", 100)
    }

    private fun crawlRange(start: LocalDate, end: LocalDate) {
        val url = "/schedule/games?fields=basic,schedule,baseball,manualRelayUrl&upperCategoryId=kbaseball&fromDate=$start&toDate=$end&size=500"
        logger.info("Crawling range: $start ~ $end")

        try {
            val response = restClient.get()
                .uri(url)
                .retrieve()
                .body(NaverScheduleResponse::class.java)

            val games = response?.result?.games ?: emptyList()
            logger.info("Fetched ${games.size} games from Naver Sports ($start ~ $end)")
            logger.info("Fetched ${games.toString()}")

            games.forEach { 
                try {
                    logger.info(it.toString())
                    processGame(it)
                } catch (e: Exception) {
                    logger.error("Failed to process game: ${it.gameId}", e)
                }
            }
            
        } catch (e: Exception) {
            logger.error("Failed to crawl schedule ($start ~ $end): ${e.message}", e)
        }
    }

    private fun processGame(dto: NaverGameDto) {
        if (dto.categoryId != "kbo") {
            logger.debug("Skipping non-KBO entry: ${dto.gameId} / category: ${dto.categoryId}")
            return
        }
        
        val gameId = dto.gameId ?: return
        val homeName = dto.homeTeamName ?: return
        val awayName = dto.awayTeamName ?: return
        val dtStr = dto.gameDateTime ?: return

        logger.info("Processing game $gameId: $homeName vs $awayName (Date: $dtStr, Status: ${dto.statusCode}, Cancel: ${dto.cancel}, Stadium: ${dto.stadium})")
        val homeTeam = findTeam(homeName)
        val awayTeam = findTeam(awayName)
        
        if (homeTeam == null || awayTeam == null) {
            logger.warn("Skipping game $gameId: Teams not found ($homeName vs $awayName)")
            return
        }

        // Naver DateTime needs parsing "yyyy-MM-dd'T'HH:mm:ss"
        val gameDateTime = LocalDateTime.parse(dtStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        
        val existingGame = gameRepository.findByGameDateTimeAndHomeTeamAndAwayTeam(
            gameDateTime, homeTeam, awayTeam
        )

        val status = mapStatus(dto.statusCode ?: "BEFORE", dto.cancel)
        val homeScore = dto.homeTeamScore ?: 0
        val awayScore = dto.awayTeamScore ?: 0

        if (existingGame != null) {
            // Upsert: Update status, score, gameId
            logger.debug("Updating game: $gameDateTime ${homeTeam.name} vs ${awayTeam.name}")
            existingGame.updateResult(homeScore, awayScore, status, gameId)
        } else {
            // New Game
            // Infer stadium name if missing
            val stadiumName = dto.stadium ?: "${homeTeam.name} Home"
            var stadium = stadiumRepository.findFirstByNameContaining(stadiumName)
            if (stadium == null) {
                logger.info("Creating new stadium: $stadiumName")
                stadium = com.ballog.backend.entity.Stadium(name = stadiumName)
                stadiumRepository.save(stadium)
            }

            logger.info("Creating new game: $gameDateTime ${homeTeam.name} vs ${awayTeam.name}")
            val newGame = Game(
                gameDateTime = gameDateTime,
                gameId = gameId,
                homeTeam = homeTeam,
                awayTeam = awayTeam,
                stadium = stadium,
                homeScore = homeScore,
                awayScore = awayScore,
                status = status
            )
            gameRepository.save(newGame)
        }
    }

    private fun mapStatus(naverStatus: String, cancel: Boolean): GameStatus {
        if (cancel) return GameStatus.CANCELED
        
        return when (naverStatus.uppercase()) {
            "BEFORE" -> GameStatus.SCHEDULED
            "LIVE" -> GameStatus.IN_PROGRESS
            "RESULT", "END" -> GameStatus.FINISHED
            "CANCEL" -> GameStatus.CANCELED
            "SUSPEND" -> GameStatus.SUSPENDED
            else -> GameStatus.SCHEDULED // Default
        }
    }

    private fun findTeam(name: String): Team? {
        return teamRepository.findByShortName(name)
    }
}
