package com.ballog.backend.config

import com.ballog.backend.entity.Team
import com.ballog.backend.repository.TeamRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.transaction.annotation.Transactional

@Configuration
class TeamInitializer(
    private val teamRepository: TeamRepository
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    @Bean
    fun initTeams() = CommandLineRunner {
        if (teamRepository.count() == 0L) {
            logger.info("Initializing KBO teams...")
            
            val teams = listOf(
                createTeam("LG Twins", "LG", "LG", "#C30452"),
                createTeam("KT Wiz", "KT", "KT", "#000000"),
                createTeam("SSG Landers", "SSG", "SSG", "#CE0E2D"),
                createTeam("NC Dinos", "NC", "NC", "#315288"),
                createTeam("Doosan Bears", "Doosan", "OB", "#131230"),
                createTeam("KIA Tigers", "KIA", "HT", "#EA0029"),
                createTeam("Lotte Giants", "Lotte", "LT", "#041E42"),
                createTeam("Samsung Lions", "Samsung", "SS", "#074CA1"),
                createTeam("Hanwha Eagles", "Hanwha", "HH", "#F37321"),
                createTeam("Kiwoom Heroes", "Kiwoom", "WO", "#820024")
            )
            
            teamRepository.saveAll(teams)
            logger.info("Initialized ${teams.size} teams.")
        } else {
            logger.info("Teams already initialized.")
        }
    }

    private fun createTeam(name: String, shortName: String, code: String, color: String): Team {
        return Team(
            name = name,
            shortName = shortName,
            code = code,
            primaryColor = color,
            logoUrl = null // Can be added later
        )
    }
}
