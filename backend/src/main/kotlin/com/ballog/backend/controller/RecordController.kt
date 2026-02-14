package com.ballog.backend.controller

import com.ballog.backend.dto.CreateRecordRequest
import com.ballog.backend.dto.CreateRecordResponse
import com.ballog.backend.dto.RecordResponse
import com.ballog.backend.dto.UpdateRecordRequest
import com.ballog.backend.service.RecordService
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/v1/records")
class RecordController(
    private val recordService: RecordService
) {
    private val log = LoggerFactory.getLogger(RecordController::class.java)

    @PostMapping
    fun createRecord(@RequestBody request: CreateRecordRequest): ResponseEntity<Any> {
        return try {
            log.info("POST /api/v1/records called with: {}", request)
            val response = recordService.createRecord(request)
            log.info("Record created successfully: {}", response)
            ResponseEntity.status(HttpStatus.CREATED).body(response)
        } catch (e: IllegalArgumentException) {
            log.error("Validation error: {}", e.message)
            ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to e.message))
        } catch (e: IllegalStateException) {
            log.error("Conflict error: {}", e.message)
            ResponseEntity.status(HttpStatus.CONFLICT)
                .body(mapOf("error" to e.message))
        } catch (e: Exception) {
            log.error("Unexpected error creating record", e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to (e.message ?: "Unknown error")))
        }
    }

    @GetMapping
    fun getRecords(@RequestParam memberId: UUID): ResponseEntity<List<RecordResponse>> {
        log.info("GET /api/v1/records?memberId={}", memberId)
        val records = recordService.getRecords(memberId)
        return ResponseEntity.ok(records)
    }

    @PutMapping("/{id}")
    fun updateRecord(
        @PathVariable id: UUID,
        @RequestBody request: UpdateRecordRequest
    ): ResponseEntity<Any> {
        return try {
            log.info("PUT /api/v1/records/{} called", id)
            val response = recordService.updateRecord(id, request)
            ResponseEntity.ok(response)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to e.message))
        }
    }

    @DeleteMapping("/{id}")
    fun deleteRecord(@PathVariable id: UUID): ResponseEntity<Any> {
        return try {
            log.info("DELETE /api/v1/records/{} called", id)
            recordService.deleteRecord(id)
            ResponseEntity.noContent().build()
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to e.message))
        }
    }
}



