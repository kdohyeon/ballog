package com.ballog.backend.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class NaverScheduleResponse(
    val result: NaverScheduleResult
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class NaverScheduleResult(
    val games: List<NaverGameDto>
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class NaverGameDto(
    val gameId: String?,
    val categoryId: String? = null,
    val gameDateTime: String?, // e.g. "2024-03-23T14:00:00"
    val homeTeamName: String?,
    val awayTeamName: String?,
    val homeTeamScore: Int?,
    val awayTeamScore: Int?,
    val statusCode: String?, // "BEFORE", "LIVE", "RESULT", "CANCEL", etc.
    val stadium: String? = null,
    val dh: Int = 0, // Double header: 0, 1, 2
    val cancel: Boolean = false
)
