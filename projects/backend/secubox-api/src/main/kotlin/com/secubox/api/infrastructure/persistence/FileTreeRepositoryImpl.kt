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
    private val mongoRepository: FileTreeMongoRepository
) : FileTreeRepository {

    override suspend fun save(fileTree: FileTree): FileTree {
        val document = FileTreeDocument.fromDomain(fileTree)
        val saved = mongoRepository.save(document).awaitSingle()
        return saved.toDomain()
    }

    override suspend fun findById(id: String): FileTree? {
        val document = mongoRepository.findById(id).awaitSingleOrNull()
        return document?.toDomain()
    }

    override fun findAll(): Flow<FileTree> {
        return mongoRepository.findAll()
            .asFlow()
            .map { it.toDomain() }
    }

    override suspend fun delete(fileTree: FileTree) {
        val document = FileTreeDocument.fromDomain(fileTree)
        mongoRepository.delete(document).awaitSingleOrNull()
    }

    override suspend fun existsById(id: String): Boolean {
        return mongoRepository.existsById(id).awaitSingle()
    }
}
