package com.secubox.api.domain.file.repository

import com.secubox.api.domain.file.model.FileMetadata

/**
 * Domain Repository Interface for FileMetadata
 */
interface FileMetadataRepository {
    suspend fun save(fileMetadata: FileMetadata): FileMetadata
    suspend fun findById(id: String): FileMetadata?
    suspend fun findByHash(hash: String): FileMetadata?
    suspend fun delete(fileMetadata: FileMetadata)
}
