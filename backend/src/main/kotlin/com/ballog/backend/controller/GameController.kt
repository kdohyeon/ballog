package com.ballog.backend.controller

import com.ballog.backend.entity.Game
import com.ballog.backend.repository.GameRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.YearMonth

@RestController
@RequestMapping("/api/v1/games")
@org.springframework.web.bind.annotation.CrossOrigin(origins = ["http://localhost:3000"])
class GameController(
    private val gameRepository: GameRepository
) {

    @GetMapping("/monthly")
    fun getMonthlySchedule(
        @RequestParam year: Int,
        @RequestParam month: Int
    ): ResponseEntity<List<Game>> {
        val yearMonth = YearMonth.of(year, month)
        val startDate = yearMonth.atDay(1).atStartOfDay()
        val endDate = yearMonth.atEndOfMonth().atTime(LocalTime.MAX)

        val games = gameRepository.findByGameDateTimeBetween(startDate, endDate)
        return ResponseEntity.ok(games)
    }
}
