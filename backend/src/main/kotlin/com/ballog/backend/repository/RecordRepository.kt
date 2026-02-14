package com.ballog.backend.repository

import com.ballog.backend.entity.Record
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface RecordRepository : JpaRepository<Record, UUID> {
    fun findByMemberIdAndGameId(memberId: UUID, gameId: UUID): Record?
    fun findByMemberIdOrderByCreatedAtDesc(memberId: UUID): List<Record>
}

