package com.secubox.api.application.filetree

import com.secubox.api.application.filetree.dto.FileTreeDTO
import com.secubox.api.domain.filetree.model.FileTree
import com.secubox.api.domain.filetree.repository.FileTreeRepository
import com.secubox.api.domain.filetree.service.FileTreeDomainService
import com.secubox.api.presentation.rest.dto.TreeObjectUpdateCommand
import org.springframework.stereotype.Service

/**
 * Application Service
 * Orchestrates use cases and coordinates domain objects
 */
@Service
class FileTreeApplicationService(
    private val fileTreeRepository: FileTreeRepository,
    private val fileTreeDomainService: FileTreeDomainService,
) {
    suspend fun getTree(userId: String): FileTreeDTO? {
        val document = fileTreeRepository.findDocumentByUserId(userId) ?: return null
        val domains = document.toDomain()
        return FileTreeDTO.fromDomain(document.id!!, domains)
    }

    suspend fun updateTree(
        documentId: String,
        commands: List<TreeObjectUpdateCommand>,
    ): FileTreeDTO? {
        // Find document by its MongoDB _id
        val existingDocument = fileTreeRepository.findDocumentById(documentId) ?: return null

        // Convert TreeUpdateCommand list to FileTree domain models and recalculate paths
        val updated = commands.map { commandToDomain(it, "/") }

        // Save with the same userId and documentId
        val saved = fileTreeRepository.saveForUser(existingDocument.userId, updated, existingDocument.id)
        return FileTreeDTO.fromDomain(existingDocument.id!!, saved)
    }

    private fun commandToDomain(
        command: TreeObjectUpdateCommand,
        parentPath: String,
    ): FileTree {
        val currentPath = parentPath
        val children =
            command.children?.map {
                commandToDomain(it, buildPath(parentPath, command.name))
            } ?: emptyList()

        return FileTree(
            id = command.id,
            name = command.name,
            type = command.type,
            path = currentPath,
            children = children,
        )
    }

    private fun buildPath(
        parentPath: String,
        name: String,
    ): String =
        if (parentPath == "/") {
            "/$name"
        } else {
            "$parentPath/$name"
        }

    /**
     * Get or create the root file tree with default RH structure
     */
    suspend fun getRootTree(): FileTreeDTO {
        // TODO: Use actual user ID from authentication context
        val userId = "default-user"

        // Check if user already has a tree
        val existingDocument = fileTreeRepository.findDocumentByUserId(userId)
        if (existingDocument != null) {
            return FileTreeDTO.fromDomain(existingDocument.id!!, existingDocument.toDomain())
        }

        // Create default tree if not exists
        val defaultTree = fileTreeDomainService.createDefaultRHStructure()
        val saved = fileTreeRepository.saveForUser(userId, listOf(defaultTree))
        val document = fileTreeRepository.findDocumentByUserId(userId)!!
        return FileTreeDTO.fromDomain(document.id!!, saved)
    }
}
