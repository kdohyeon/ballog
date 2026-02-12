package com.ballog.backend.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "teams")
class Team(
    @Column(nullable = false)
    var name: String,

    @Column(name = "short_name", nullable = false)
    var shortName: String,

    @Column(unique = true)
    var code: String? = null,

    @Column(name = "logo_url")
    var logoUrl: String? = null,

    @Column(name = "primary_color")
    var primaryColor: String? = null
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
