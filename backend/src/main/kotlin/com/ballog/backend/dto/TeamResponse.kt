package com.ballog.backend.dto

import java.util.UUID

data class TeamResponse(
    val id: UUID,
    val name: String,
    val shortName: String,
    val code: String?,
    val logoUrl: String?,
    val primaryColor: String?
)
