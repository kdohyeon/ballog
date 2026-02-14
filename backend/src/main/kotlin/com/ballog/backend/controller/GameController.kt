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
                homeTeamId = it.homeTeam.id!!,
                awayTeamId = it.awayTeam.id!!,
                homeTeamName = it.homeTeam.name,
                awayTeamName = it.awayTeam.name,
                stadiumId = it.stadium.id!!,
                stadiumName = it.stadium.name,
                homeScore = it.homeScore,
                awayScore = it.awayScore,
                status = it.status
            )
        }
        return ResponseEntity.ok(response)
    }
}
