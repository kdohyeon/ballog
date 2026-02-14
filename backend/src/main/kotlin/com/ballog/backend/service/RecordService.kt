package com.ballog.backend.service

import com.ballog.backend.dto.CreateRecordRequest
import com.ballog.backend.dto.CreateRecordResponse
import com.ballog.backend.dto.RecordResponse
import com.ballog.backend.dto.UpdateRecordRequest
import com.ballog.backend.entity.Game
import com.ballog.backend.entity.GameStatus
import com.ballog.backend.entity.Record
import com.ballog.backend.entity.Team
import com.ballog.backend.repository.GameRepository
import com.ballog.backend.repository.MemberRepository
import com.ballog.backend.repository.RecordRepository
import com.ballog.backend.repository.TeamRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class RecordService(
    private val recordRepository: RecordRepository,
    private val memberRepository: MemberRepository,
    private val gameRepository: GameRepository,
    private val teamRepository: TeamRepository
) {
    private val log = LoggerFactory.getLogger(RecordService::class.java)

    @Transactional
    fun createRecord(request: CreateRecordRequest): CreateRecordResponse {
        log.info("Creating record: memberId={}, gameId={}, supportedTeamId={}",
            request.memberId, request.gameId, request.supportedTeamId)

        val member = memberRepository.findById(request.memberId)
            .orElseThrow { IllegalArgumentException("Member not found: ${request.memberId}") }

        val game = gameRepository.findById(request.gameId)
            .orElseThrow { IllegalArgumentException("Game not found: ${request.gameId}") }

        // Check for duplicate record
        val existing = recordRepository.findByMemberIdAndGameId(request.memberId, request.gameId)
        if (existing != null) {
            throw IllegalStateException("Record already exists for this member and game")
        }

        // Determine supported team: explicit > member's preferred team
        val supportedTeam = when {
            request.supportedTeamId != null -> teamRepository.findById(request.supportedTeamId)
                .orElseThrow { IllegalArgumentException("Team not found: ${request.supportedTeamId}") }
            else -> member.preferredTeam
        }
        log.info("Supported team: {}", supportedTeam?.id)

        // Calculate result snapshot
        val resultSnapshot = calculateResult(game, supportedTeam)
        log.info("Calculated result: {}", resultSnapshot)

        val record = Record(
            member = member,
            game = game,
            supportedTeam = supportedTeam,
            resultSnapshot = resultSnapshot,
            seatInfo = request.seatInfo,
            content = request.content,
            ticketImageUrl = request.ticketImageUrl
        )

        val saved = recordRepository.saveAndFlush(record)
        log.info("Record saved successfully: id={}", saved.id)

        return CreateRecordResponse(
            recordId = saved.id!!,
            resultSnapshot = saved.resultSnapshot
        )
    }

    @Transactional(readOnly = true)
    fun getRecords(memberId: UUID): List<RecordResponse> {
        val records = recordRepository.findByMemberIdOrderByCreatedAtDesc(memberId)
        return records.map { it.toResponse() }
    }

    @Transactional
    fun updateRecord(recordId: UUID, request: UpdateRecordRequest): RecordResponse {
        val record = recordRepository.findById(recordId)
            .orElseThrow { IllegalArgumentException("Record not found: $recordId") }
        record.seatInfo = request.seatInfo
        record.content = request.content
        record.ticketImageUrl = request.ticketImageUrl
        val saved = recordRepository.saveAndFlush(record)
        log.info("Record updated: id={}", saved.id)
        return saved.toResponse()
    }

    @Transactional
    fun deleteRecord(recordId: UUID) {
        if (!recordRepository.existsById(recordId)) {
            throw IllegalArgumentException("Record not found: $recordId")
        }
        recordRepository.deleteById(recordId)
        log.info("Record deleted: id={}", recordId)
    }

    private fun Record.toResponse() = RecordResponse(
        id = this.id!!,
        gameId = this.game.id!!,
        gameDateTime = this.game.gameDateTime,
        homeTeamId = this.game.homeTeam.id!!,
        awayTeamId = this.game.awayTeam.id!!,
        homeTeamName = this.game.homeTeam.name,
        awayTeamName = this.game.awayTeam.name,
        homeScore = this.game.homeScore,
        awayScore = this.game.awayScore,
        resultSnapshot = this.resultSnapshot,
        supportedTeamId = this.supportedTeam?.id,
        supportedTeamName = this.supportedTeam?.name,
        seatInfo = this.seatInfo,
        content = this.content,
        ticketImageUrl = this.ticketImageUrl,
        createdAt = this.createdAt
    )

    private fun calculateResult(game: Game, supportedTeam: Team?): String? {
        if (supportedTeam == null) return null
        if (game.status != GameStatus.FINISHED) return null

        val supportedTeamId = supportedTeam.id
        val homeTeamId = game.homeTeam.id
        val awayTeamId = game.awayTeam.id

        return when {
            supportedTeamId == homeTeamId -> compareScores(game.homeScore, game.awayScore)
            supportedTeamId == awayTeamId -> compareScores(game.awayScore, game.homeScore)
            else -> null
        }
    }

    private fun compareScores(myScore: Int, opponentScore: Int): String {
        return when {
            myScore > opponentScore -> "WIN"
            myScore < opponentScore -> "LOSE"
            else -> "DRAW"
        }
    }
}


