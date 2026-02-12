package com.ballog.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BallogApplication

fun main(args: Array<String>) {
	runApplication<BallogApplication>(*args)
}
