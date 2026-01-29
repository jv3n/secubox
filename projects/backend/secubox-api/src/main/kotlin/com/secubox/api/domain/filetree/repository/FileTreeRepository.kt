package com.secubox.api.domain.filetree.repository

import com.secubox.api.domain.filetree.model.FileTree
import com.secubox.api.infrastructure.persistence.FileTreeDocument
import kotlinx.coroutines.flow.Flow

/**
 * Domain Repository Interface (Port)
 * Infrastructure will implement this
 */
interface FileTreeRepository {
    suspend fun saveForUser(
        userId: String,
        fileTrees: List<FileTree>,
        documentId: String? = null,
    ): List<FileTree>

    suspend fun findByUserId(userId: String): List<FileTree>?

    suspend fun findDocumentByUserId(userId: String): FileTreeDocument?

    suspend fun findDocumentById(documentId: String): FileTreeDocument?

    fun findAll(): Flow<List<FileTree>>

    suspend fun deleteByUserId(userId: String)

    suspend fun existsByUserId(userId: String): Boolean
}
