package com.secubox.api.domain.filetree.service

import com.secubox.api.domain.filetree.model.FileTree
import org.springframework.stereotype.Service

/**
 * Domain Service for FileTree business logic
 * that doesn't naturally fit in the aggregate
 */
@Service
class FileTreeDomainService {

    /**
     * Create default RH structure
     */
    fun createDefaultRHStructure(): FileTree {
        val administration = FileTree.createFolder("Administration")
        val bulletinsDePaie = FileTree.createFolder("Bulletins de paie")

        return FileTree.createFolder("RH")
            .addChild(administration)
            .addChild(bulletinsDePaie)
    }

    /**
     * Validate if a node can be moved to a target folder
     */
    fun canMove(source: FileTree, target: FileTree): Boolean {
        if (!target.isFolder()) return false
        if (source.id == target.id) return false
        // Prevent moving a folder into itself or its descendants
        return !isDescendant(target, source)
    }

    /**
     * Check if potential child is a descendant of parent
     */
    private fun isDescendant(potentialChild: FileTree, parent: FileTree): Boolean {
        if (potentialChild.id == parent.id) return true
        return parent.children.any { isDescendant(potentialChild, it) }
    }
}
