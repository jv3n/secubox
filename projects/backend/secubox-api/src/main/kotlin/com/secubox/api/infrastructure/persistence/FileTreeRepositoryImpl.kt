package com.secubox.api.infrastructure.persistence

import com.secubox.api.domain.filetree.model.FileTree
import com.secubox.api.domain.filetree.repository.FileTreeRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactive.awaitSingleOrNull
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.stereotype.Repository

/**
 * Infrastructure implementation of domain repository
 * Adapts MongoDB to domain interface
 */
@Repository
class FileTreeRepositoryImpl(
    private val mongoRepository: FileTreeMongoRepository,
) : FileTreeRepository {
    override suspend fun saveForUser(
        userId: String,
        fileTrees: List<FileTree>,
        documentId: String?,
    ): List<FileTree> {
        val document = FileTreeDocument.fromDomain(userId, fileTrees, documentId)
        val saved = mongoRepository.save(document).awaitSingle()
        return saved.toDomain()
    }

    override suspend fun findByUserId(userId: String): List<FileTree>? {
        val document = mongoRepository.findByUserId(userId).awaitSingleOrNull()
        return document?.toDomain()
    }

    override suspend fun findDocumentByUserId(userId: String): FileTreeDocument? = mongoRepository.findByUserId(userId).awaitSingleOrNull()

    override suspend fun findDocumentById(documentId: String): FileTreeDocument? = mongoRepository.findById(documentId).awaitSingleOrNull()

    override fun findAll(): Flow<List<FileTree>> =
        mongoRepository
            .findAll()
            .asFlow()
            .map { it.toDomain() }

    override suspend fun deleteByUserId(userId: String) {
        mongoRepository.deleteByUserId(userId).awaitSingleOrNull()
    }

    override suspend fun existsByUserId(userId: String): Boolean = mongoRepository.existsByUserId(userId).awaitSingle()
}
