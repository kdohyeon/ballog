package com.ballog.backend.dto

import com.ballog.backend.entity.GameStatus
import java.time.LocalDateTime
import java.util.UUID

data class GameResponse(
    val id: UUID,
    val gameDateTime: LocalDateTime,
    val gameId: String?,
    val homeTeam: TeamResponse,
    val awayTeam: TeamResponse,
    val stadium: StadiumResponse,
    val homeScore: Int,
    val awayScore: Int,
    val status: GameStatus
)
