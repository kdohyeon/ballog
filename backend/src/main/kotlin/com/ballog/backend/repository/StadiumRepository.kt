package com.ballog.backend.repository

import com.ballog.backend.entity.Stadium
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface StadiumRepository : JpaRepository<Stadium, UUID> {
    fun findByName(name: String): Stadium?
}
