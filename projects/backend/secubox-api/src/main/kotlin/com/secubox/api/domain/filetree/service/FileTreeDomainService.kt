package com.secubox.api.domain.filetree.service

import com.secubox.api.domain.filetree.model.FileTree
import org.springframework.stereotype.Service
import java.util.UUID

/**
 * Domain Service for FileTree business logic
 * that doesn't naturally fit in the aggregate
 */
@Service
class FileTreeDomainService {
    /**
     * Create default RH structure with generated IDs
     */
    fun createDefaultRHStructure(): FileTree {
        val administration = FileTree.createFolder("Administration", "/RH").copy(id = UUID.randomUUID().toString())
        val bulletinsDePaie = FileTree.createFolder("Bulletins de paie", "/RH").copy(id = UUID.randomUUID().toString())

        return FileTree
            .createFolder("RH", "/")
            .copy(id = UUID.randomUUID().toString())
            .addChild(administration)
            .addChild(bulletinsDePaie)
    }

    /**
     * Generate IDs for a tree and all its children recursively
     */
    fun generateIds(tree: FileTree): FileTree =
        tree.copy(
            id = tree.id ?: UUID.randomUUID().toString(),
            children = tree.children.map { generateIds(it) },
        )

    /**
     * Validate if a node can be moved to a target folder
     */
    fun canMove(
        source: FileTree,
        target: FileTree,
    ): Boolean {
        if (!target.isFolder()) return false
        if (source.id == target.id) return false
        // Prevent moving a folder into itself or its descendants
        return !isDescendant(target, source)
    }

    /**
     * Check if potential child is a descendant of parent
     */
    private fun isDescendant(
        potentialChild: FileTree,
        parent: FileTree,
    ): Boolean {
        if (potentialChild.id == parent.id) return true
        return parent.children.any { isDescendant(potentialChild, it) }
    }
}
