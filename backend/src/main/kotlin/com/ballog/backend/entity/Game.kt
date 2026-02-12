package com.ballog.backend.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(
    name = "games",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["game_date_time", "home_team_id", "away_team_id"])
    ]
)
class Game(
    @Column(name = "game_date_time", nullable = false)
    var gameDateTime: LocalDateTime,

    @Column(name = "game_id")
    var gameId: String? = null, // External ID (Naver)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_team_id", nullable = false)
    var homeTeam: Team,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "away_team_id", nullable = false)
    var awayTeam: Team,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stadium_id", nullable = false)
    var stadium: Stadium,

    @Column(name = "home_score")
    var homeScore: Int = 0,

    @Column(name = "away_score")
    var awayScore: Int = 0,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: GameStatus = GameStatus.SCHEDULED
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
    
    fun updateResult(homeScore: Int, awayScore: Int, status: GameStatus, gameId: String?) {
        this.homeScore = homeScore
        this.awayScore = awayScore
        this.status = status
        this.gameId = gameId
    }
}
