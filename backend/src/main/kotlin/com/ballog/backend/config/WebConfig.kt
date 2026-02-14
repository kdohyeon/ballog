package com.ballog.backend.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig(
    @Value("\${app.cors.allowed-origin-patterns:*}")
    private val allowedOriginPatterns: String
) : WebMvcConfigurer {

    override fun addCorsMappings(registry: CorsRegistry) {
        val patterns = allowedOriginPatterns.split(",").map { it.trim() }

        registry.addMapping("/**")
            .allowedOriginPatterns(*patterns.toTypedArray())
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
            .allowedHeaders("*")
            .exposedHeaders("Location")
            .allowCredentials(true)
            .maxAge(3600)
    }
}

