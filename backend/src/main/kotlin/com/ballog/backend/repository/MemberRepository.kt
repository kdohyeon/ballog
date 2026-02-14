package com.ballog.backend.repository

import com.ballog.backend.entity.Member
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface MemberRepository : JpaRepository<Member, UUID>
