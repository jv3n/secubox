package com.secubox.api.repository

import com.secubox.api.entity.FileMetadata
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository

@Repository
interface FileMetadataRepository : ReactiveMongoRepository<FileMetadata, String> {
    suspend fun findByHash(hash: String): FileMetadata?
}
