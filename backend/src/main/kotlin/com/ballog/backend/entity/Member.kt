package com.ballog.backend.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "members")
class Member(
    @Column(nullable = false, unique = true)
    var uid: String,

    @Column(length = 50)
    var nickname: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preferred_team_id")
    var preferredTeam: Team? = null
) {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null

    @Column(name = "created_at", updatable = false)
    var createdAt: LocalDateTime? = LocalDateTime.now()

    @Column(name = "updated_at")
    var updatedAt: LocalDateTime? = LocalDateTime.now()

    @PreUpdate
    fun onPreUpdate() {
        updatedAt = LocalDateTime.now()
    }
}
