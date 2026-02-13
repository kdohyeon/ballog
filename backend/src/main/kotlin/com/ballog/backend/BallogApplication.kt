package com.ballog.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

import org.springframework.scheduling.annotation.EnableAsync

@EnableAsync
@SpringBootApplication
class BallogApplication

fun main(args: Array<String>) {
	runApplication<BallogApplication>(*args)
}
