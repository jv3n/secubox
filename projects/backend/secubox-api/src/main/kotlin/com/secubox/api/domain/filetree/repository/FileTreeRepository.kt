package com.secubox.api.domain.filetree.repository

import com.secubox.api.domain.filetree.model.FileTree
import kotlinx.coroutines.flow.Flow

/**
 * Domain Repository Interface (Port)
 * Infrastructure will implement this
 */
interface FileTreeRepository {
    suspend fun save(fileTree: FileTree): FileTree
    suspend fun findById(id: String): FileTree?
    fun findAll(): Flow<FileTree>
    suspend fun delete(fileTree: FileTree)
    suspend fun existsById(id: String): Boolean
}
