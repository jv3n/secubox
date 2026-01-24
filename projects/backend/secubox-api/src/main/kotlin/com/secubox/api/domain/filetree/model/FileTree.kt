package com.secubox.api.domain.filetree.model

import java.time.Instant

/**
 * FileTree Aggregate Root
 * Represents a hierarchical file/folder structure
 */
data class FileTree(
    val id: String? = null,
    val name: String,
    val type: NodeType,
    val hash: String? = null,
    val size: Long? = null,
    val children: List<FileTree> = emptyList(),
    val createdAt: Instant = Instant.now(),
    val updatedAt: Instant = Instant.now(),
    val version: Int = 1
) {
    init {
        require(name.isNotBlank()) { "File tree name cannot be blank" }
        if (type == NodeType.FILE) {
            require(children.isEmpty()) { "Files cannot have children" }
        }
    }

    fun isFolder(): Boolean = type == NodeType.FOLDER
    fun isFile(): Boolean = type == NodeType.FILE

    fun addChild(child: FileTree): FileTree {
        require(isFolder()) { "Cannot add children to a file" }
        return copy(
            children = children + child,
            updatedAt = Instant.now()
        )
    }

    fun removeChild(childId: String): FileTree {
        require(isFolder()) { "Cannot remove children from a file" }
        return copy(
            children = children.filterNot { it.id == childId },
            updatedAt = Instant.now()
        )
    }

    companion object {
        fun createFolder(name: String): FileTree {
            return FileTree(
                name = name,
                type = NodeType.FOLDER
            )
        }

        fun createFile(name: String, hash: String, size: Long): FileTree {
            return FileTree(
                name = name,
                type = NodeType.FILE,
                hash = hash,
                size = size
            )
        }
    }
}
