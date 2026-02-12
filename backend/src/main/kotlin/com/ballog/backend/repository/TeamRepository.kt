package com.ballog.backend.repository

import com.ballog.backend.entity.Team
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface TeamRepository : JpaRepository<Team, UUID> {
    fun findByName(name: String): Team?
    fun findByCode(code: String): Team?
}
