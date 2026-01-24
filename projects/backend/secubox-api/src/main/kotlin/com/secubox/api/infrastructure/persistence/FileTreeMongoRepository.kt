package com.secubox.api.infrastructure.persistence

import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository

/**
 * Spring Data MongoDB Repository
 */
@Repository
interface FileTreeMongoRepository : ReactiveMongoRepository<FileTreeDocument, String>
