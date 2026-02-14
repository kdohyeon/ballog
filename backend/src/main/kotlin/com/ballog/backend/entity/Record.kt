package com.ballog.backend.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(
    name = "records",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["member_id", "game_id"])
    ]
)
class Record(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    var member: Member,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    var game: Game,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supported_team_id")
    var supportedTeam: Team? = null,

    @Column(name = "result_snapshot", length = 20)
    var resultSnapshot: String? = null,

    @Column(name = "seat_info")
    var seatInfo: String? = null,

    @Column(columnDefinition = "TEXT")
    var content: String? = null,

    @Column(name = "ticket_image_url", columnDefinition = "TEXT")
    var ticketImageUrl: String? = null
) {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null

    @Column(name = "created_at", updatable = false)
    var createdAt: LocalDateTime? = LocalDateTime.now()
}
