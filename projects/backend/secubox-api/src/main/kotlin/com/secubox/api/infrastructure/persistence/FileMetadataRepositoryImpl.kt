package com.secubox.api.infrastructure.persistence

import com.secubox.api.domain.file.model.FileMetadata
import com.secubox.api.domain.file.repository.FileMetadataRepository
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.awaitSingle
import org.springframework.stereotype.Repository

@Repository
class FileMetadataRepositoryImpl(
    private val mongoRepository: FileMetadataMongoRepository
) : FileMetadataRepository {

    override suspend fun save(fileMetadata: FileMetadata): FileMetadata {
        val document = FileMetadataDocument.fromDomain(fileMetadata)
        val saved = mongoRepository.save(document).awaitSingle()
        return saved.toDomain()
    }

    override suspend fun findById(id: String): FileMetadata? {
        val document = mongoRepository.findById(id).awaitFirstOrNull()
        return document?.toDomain()
    }

    override suspend fun findByHash(hash: String): FileMetadata? {
        val document = mongoRepository.findByHash(hash).awaitFirstOrNull()
        return document?.toDomain()
    }

    override suspend fun delete(fileMetadata: FileMetadata) {
        val document = FileMetadataDocument.fromDomain(fileMetadata)
        mongoRepository.delete(document).awaitFirstOrNull()
    }
}
