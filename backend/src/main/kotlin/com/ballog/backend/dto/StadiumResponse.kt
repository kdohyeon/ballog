package com.ballog.backend.dto

import java.util.UUID

data class StadiumResponse(
    val id: UUID,
    val name: String,
    val weatherKeyword: String?
)
