package com.ballog.backend.dto

import com.ballog.backend.entity.GameStatus
import java.time.LocalDateTime
import java.util.UUID

data class GameResponse(
    val id: UUID,
    val gameDateTime: LocalDateTime,
    val gameId: String?,
    val homeTeamId: UUID,
    val awayTeamId: UUID,
    val homeTeamName: String,
    val homeTeamCode: String,
    val homeTeamPrimaryColor: String,
    val awayTeamName: String,
    val awayTeamCode: String,
    val awayTeamPrimaryColor: String,
    val stadiumId: UUID,
    val stadiumName: String,
    val homeScore: Int,
    val awayScore: Int,
    val status: GameStatus
)
