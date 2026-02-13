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
        .build()

    @Transactional
    fun crawlSchedule(startDate: LocalDate, endDate: LocalDate) {
        logger.info("Starting KBO schedule crawl from $startDate to $endDate")
        
        val url = "/schedule/games?fields=basic,super_match&baseballScheduleCategory=kbo&categoryId=kbo&fromDate=$startDate&toDate=$endDate"
        
        try {
            val response = restClient.get()
                .uri(url)
                .retrieve()
                .body(NaverScheduleResponse::class.java)

            val games = response?.result?.games ?: emptyList()
            logger.info("Fetched ${games.size} games from Naver Sports")

            games.forEach { 
                try {
                    processGame(it)
                } catch (e: Exception) {
                    logger.error("Failed to process game: ${it.gameId}", e)
                }
            }
            
        } catch (e: Exception) {
            logger.error("Failed to crawl schedule: ${e.message}")
            // throw e
        }
    }

    private fun processGame(dto: NaverGameDto) {
        logger.info("Processing game ${dto.gameId}: ${dto.homeTeamName} vs ${dto.awayTeamName} (Date: ${dto.gameDateTime})")
        val homeTeam = findTeam(dto.homeTeamName)
        val awayTeam = findTeam(dto.awayTeamName)
        
        if (homeTeam == null || awayTeam == null) {
            logger.warn("Skipping game ${dto.gameId}: Teams not found (${dto.homeTeamName} vs ${dto.awayTeamName})")
            return
        }

        // Naver DateTime needs parsing "yyyy-MM-dd'T'HH:mm:ss"
        val gameDateTime = LocalDateTime.parse(dto.gameDateTime, DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        
        val existingGame = gameRepository.findByGameDateTimeAndHomeTeamAndAwayTeam(
            gameDateTime, homeTeam, awayTeam
        )

        val status = mapStatus(dto.statusCode)
        val homeScore = dto.homeTeamScore ?: 0
        val awayScore = dto.awayTeamScore ?: 0

        if (existingGame != null) {
            // Upsert: Update status, score, gameId
            logger.debug("Updating game: $gameDateTime ${homeTeam.name} vs ${awayTeam.name}")
            existingGame.updateResult(homeScore, awayScore, status, dto.gameId)
            // Stadium update could be optional, but usually fixed. 
            // If stadium changed (rare), we might check.
        } else {
            // New Game
            // Infer stadium name if missing
            val stadiumName = dto.stadium ?: "${homeTeam.name} Home"
            var stadium = stadiumRepository.findByName(stadiumName)
            if (stadium == null) {
                logger.info("Creating new stadium: $stadiumName")
                stadium = com.ballog.backend.entity.Stadium(name = stadiumName)
                stadiumRepository.save(stadium)
            }

            logger.info("Creating new game: $gameDateTime ${homeTeam.name} vs ${awayTeam.name}")
            val newGame = Game(
                gameDateTime = gameDateTime,
                gameId = dto.gameId,
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

    private fun mapStatus(naverStatus: String): GameStatus {
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
        return teamRepository.findByName(name)
            ?: teamRepository.findByShortName(name)
            ?: when(name.uppercase()) {
                "KT" -> teamRepository.findByName("kt wiz")
                "KIA" -> teamRepository.findByName("KIA Tigers")
                "SSG" -> teamRepository.findByName("SSG Landers")
                "NC" -> teamRepository.findByName("NC Dinos")
                "LG" -> teamRepository.findByName("LG Twins")
                "두산" -> teamRepository.findByName("Doosan Bears")
                "키움" -> teamRepository.findByName("Kiwoom Heroes")
                "롯데" -> teamRepository.findByName("Lotte Giants")
                "삼성" -> teamRepository.findByName("Samsung Lions")
                "한화" -> teamRepository.findByName("Hanwha Eagles")
                else -> null
            }
    }
}
