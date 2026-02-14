package com.ballog.backend.controller

import com.ballog.backend.dto.TeamResponse
import com.ballog.backend.repository.TeamRepository
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/teams")
class TeamController(
    private val teamRepository: TeamRepository
) {
    private val log = LoggerFactory.getLogger(TeamController::class.java)

    @GetMapping
    fun getTeams(): ResponseEntity<List<TeamResponse>> {
        log.info("GET /api/v1/teams called")
        val teams = teamRepository.findAll().map {
            TeamResponse(
                id = it.id!!,
                name = it.name,
                shortName = it.shortName,
                code = it.code,
                logoUrl = it.logoUrl,
                primaryColor = it.primaryColor
            )
        }
        return ResponseEntity.ok(teams)
    }
}
