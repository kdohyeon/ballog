package com.ballog.backend.dto

import java.time.LocalDateTime
import java.util.UUID

data class CreateRecordRequest(
    val memberId: UUID,
    val gameId: UUID,
    val supportedTeamId: UUID? = null,
    val seatInfo: String? = null,
    val content: String? = null,
    val ticketImageUrl: String? = null
)

data class UpdateRecordRequest(
    val seatInfo: String? = null,
    val content: String? = null,
    val ticketImageUrl: String? = null
)

data class CreateRecordResponse(
    val recordId: UUID,
    val resultSnapshot: String?
)

data class RecordResponse(
    val id: UUID,
    val gameId: UUID,
    val gameDateTime: LocalDateTime,
    val homeTeamId: UUID,
    val awayTeamId: UUID,
    val homeTeamName: String,
    val awayTeamName: String,
    val homeScore: Int,
    val awayScore: Int,
    val resultSnapshot: String?,
    val supportedTeamId: UUID?,
    val supportedTeamName: String?,
    val seatInfo: String?,
    val content: String?,
    val ticketImageUrl: String?,
    val createdAt: LocalDateTime?
)


