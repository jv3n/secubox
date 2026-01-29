package com.secubox.api.application.filetree

import com.secubox.api.application.filetree.dto.FileTreeDTO
import com.secubox.api.domain.filetree.model.FileTree
import com.secubox.api.domain.filetree.model.NodeType
import com.secubox.api.domain.filetree.repository.FileTreeRepository
import com.secubox.api.domain.filetree.service.FileTreeDomainService
import com.secubox.api.presentation.rest.dto.TreeUpdateCommand
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import org.springframework.stereotype.Service

/**
 * Application Service
 * Orchestrates use cases and coordinates domain objects
 */
@Service
class FileTreeApplicationService(
    private val fileTreeRepository: FileTreeRepository,
    private val fileTreeDomainService: FileTreeDomainService
) {

    suspend fun createTree(dto: FileTreeDTO): FileTreeDTO {
        val domain = dto.toDomain()
        val saved = fileTreeRepository.save(domain)
        return FileTreeDTO.fromDomain(saved)
    }

    suspend fun getTree(id: String): FileTreeDTO? {
        val domain = fileTreeRepository.findById(id) ?: return null
        return FileTreeDTO.fromDomain(domain)
    }

    fun getAllTrees(): Flow<FileTreeDTO> {
        return fileTreeRepository.findAll()
            .map { FileTreeDTO.fromDomain(it) }
    }

    suspend fun updateTree(id: String, command: TreeUpdateCommand): FileTreeDTO? {
        val existing = fileTreeRepository.findById(id) ?: return null

        // Convert TreeUpdateCommand to FileTree domain model
        val updated = commandToDomain(command).copy(
            id = id,
            version = existing.version + 1
        )

        val saved = fileTreeRepository.save(updated)
        return FileTreeDTO.fromDomain(saved)
    }

    private fun commandToDomain(command: TreeUpdateCommand): FileTree {
        val nodeType = if (command.file != null) NodeType.FILE else NodeType.FOLDER

        return FileTree(
            id = command.id,
            name = command.name,
            type = nodeType,
            hash = command.file?.name,
            size = command.file?.size,
            children = command.childrens?.map { commandToDomain(it) } ?: emptyList()
        )
    }

    suspend fun deleteTree(id: String): Boolean {
        val existing = fileTreeRepository.findById(id) ?: return false
        fileTreeRepository.delete(existing)
        return true
    }

    /**
     * Get or create the root file tree with default RH structure
     */
    suspend fun getRootTree(): FileTreeDTO {
        val existingTrees = fileTreeRepository.findAll().toList()

        if (existingTrees.isNotEmpty()) {
            return FileTreeDTO.fromDomain(existingTrees.first())
        }

        // Create default RH structure using domain service
        val defaultTree = fileTreeDomainService.createDefaultRHStructure()
        val saved = fileTreeRepository.save(defaultTree)
        return FileTreeDTO.fromDomain(saved)
    }

    /**
     * Update the root tree
     */
    suspend fun updateRootTree(command: TreeUpdateCommand): FileTreeDTO {
        val existingTrees = fileTreeRepository.findAll().toList()
        val existingRoot = existingTrees.firstOrNull()

        val updated = commandToDomain(command).copy(
            id = existingRoot?.id,
            version = (existingRoot?.version ?: 0) + 1
        )

        val saved = fileTreeRepository.save(updated)
        return FileTreeDTO.fromDomain(saved)
    }
}
