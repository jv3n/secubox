package com.secubox.api.service

import com.secubox.api.entity.FileTree
import com.secubox.api.repository.FileTreeRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.stereotype.Service

@Service
class FileTreeService(
    private val fileTreeRepository: FileTreeRepository
) {

    suspend fun createTree(fileTree: FileTree): FileTree {
        return fileTreeRepository.save(fileTree).awaitSingle()
    }

    suspend fun getTree(id: String): FileTree? {
        return fileTreeRepository.findById(id).awaitSingleOrNull()
    }

    fun getAllTrees(): Flow<FileTree> {
        return fileTreeRepository.findAll().asFlow()
    }

    suspend fun updateTree(id: String, fileTree: FileTree): FileTree? {
        val existing = fileTreeRepository.findById(id).awaitSingleOrNull() ?: return null
        val updated = fileTree.copy(
            id = id,
            version = existing.version + 1
        )
        return fileTreeRepository.save(updated).awaitSingle()
    }

    suspend fun deleteTree(id: String): Boolean {
        val existing = fileTreeRepository.findById(id).awaitSingleOrNull() ?: return false
        fileTreeRepository.delete(existing).awaitSingleOrNull()
        return true
    }
}
