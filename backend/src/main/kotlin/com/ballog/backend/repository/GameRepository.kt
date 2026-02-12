package com.ballog.backend.repository

import com.ballog.backend.entity.Game
import com.ballog.backend.entity.Team
import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDateTime
import java.util.UUID

interface GameRepository : JpaRepository<Game, UUID> {
    fun findByGameDateTimeBetween(start: LocalDateTime, end: LocalDateTime): List<Game>
    
    fun findByGameDateTimeAndHomeTeamAndAwayTeam(
        gameDateTime: LocalDateTime, 
        homeTeam: Team, 
        awayTeam: Team
    ): Game?
}
