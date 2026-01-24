package com.secubox.api.infrastructure.persistence

import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface FileMetadataMongoRepository : ReactiveMongoRepository<FileMetadataDocument, String> {
    fun findByHash(hash: String): Mono<FileMetadataDocument>
}
