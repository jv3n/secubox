package com.secubox.api.infrastructure.persistence

import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

/**
 * Spring Data MongoDB Repository
 */
@Repository
interface FileTreeMongoRepository : ReactiveMongoRepository<FileTreeDocument, String> {
    fun findByUserId(userId: String): Mono<FileTreeDocument>

    fun deleteByUserId(userId: String): Mono<Void>

    fun existsByUserId(userId: String): Mono<Boolean>
}
