package com.secubox.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories

@SpringBootApplication
@EnableReactiveMongoRepositories
class SecuboxApiApplication

fun main(args: Array<String>) {
    runApplication<SecuboxApiApplication>(*args)
}
