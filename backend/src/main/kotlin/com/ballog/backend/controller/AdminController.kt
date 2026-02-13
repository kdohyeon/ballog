package com.ballog.backend.controller

import com.ballog.backend.service.KboCrawlerService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
@RequestMapping("/api/v1/admin")
class AdminController(
    private val kboCrawlerService: KboCrawlerService
) {

    @PostMapping("/crawl/schedule")
    fun crawlSchedule(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) startDate: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) endDate: LocalDate
    ): ResponseEntity<String> {
        kboCrawlerService.crawlSchedule(startDate, endDate)
        return ResponseEntity.accepted().body("Crawling initiated in background from $startDate to $endDate")
    }

    @org.springframework.web.bind.annotation.GetMapping("/crawl/progress", produces = [org.springframework.http.MediaType.TEXT_EVENT_STREAM_VALUE])
    fun streamProgress(): org.springframework.web.servlet.mvc.method.annotation.SseEmitter {
        return kboCrawlerService.subscribe()
    }
}
