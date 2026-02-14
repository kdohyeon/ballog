package com.ballog.backend.controller

import com.ballog.backend.dto.GameResponse
import com.ballog.backend.repository.GameRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.transaction.annotation.Transactional
import java.time.LocalTime
import java.time.YearMonth

@RestController
@RequestMapping("/api/v1/games")
class GameController(
    private val gameRepository: GameRepository
) {
    private val log = org.slf4j.LoggerFactory.getLogger(GameController::class.java)

    @GetMapping("/monthly")
    @Transactional(readOnly = true)
    fun getMonthlySchedule(
        @RequestParam year: Int,
        @RequestParam month: Int
    ): ResponseEntity<List<GameResponse>> {
        log.info("GET /api/v1/games/monthly called for year=$year, month=$month")
        val yearMonth = YearMonth.of(year, month)
        val startDate = yearMonth.atDay(1).atStartOfDay()
        val endDate = yearMonth.atEndOfMonth().atTime(LocalTime.MAX)

        val games = gameRepository.findByGameDateTimeBetween(startDate, endDate)
        val response = games.map {
            GameResponse(
                id = it.id!!,
                gameDateTime = it.gameDateTime,
                gameId = it.gameId,
                homeTeam = com.ballog.backend.dto.TeamResponse(
                    id = it.homeTeam.id!!,
                    name = it.homeTeam.name,
                    shortName = it.homeTeam.shortName,
                    code = it.homeTeam.code,
                    logoUrl = it.homeTeam.logoUrl,
                    primaryColor = it.homeTeam.primaryColor
                ),
                awayTeam = com.ballog.backend.dto.TeamResponse(
                    id = it.awayTeam.id!!,
                    name = it.awayTeam.name,
                    shortName = it.awayTeam.shortName,
                    code = it.awayTeam.code,
                    logoUrl = it.awayTeam.logoUrl,
                    primaryColor = it.awayTeam.primaryColor
                ),
                stadium = com.ballog.backend.dto.StadiumResponse(
                    id = it.stadium.id!!,
                    name = it.stadium.name,
                    weatherKeyword = it.stadium.weatherKeyword
                ),
                homeScore = it.homeScore,
                awayScore = it.awayScore,
                status = it.status
            )
        }
        return ResponseEntity.ok(response)
    }
}
