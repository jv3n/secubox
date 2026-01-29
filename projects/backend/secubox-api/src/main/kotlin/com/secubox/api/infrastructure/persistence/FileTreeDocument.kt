package com.secubox.api.infrastructure.persistence

import com.secubox.api.domain.filetree.model.FileTree
import com.secubox.api.domain.filetree.model.NodeType
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

/**
 * MongoDB Document for FileTree nodes
 */
data class FileTreeNode(
    val id: String? = null,
    val name: String,
    val type: NodeType,
    val path: String? = null,
    val children: List<FileTreeNode> = emptyList(),
) {
    companion object {
        fun fromDomain(domain: FileTree): FileTreeNode =
            FileTreeNode(
                id = domain.id,
                name = domain.name,
                type = domain.type,
                path = domain.path,
                children = domain.children.map { fromDomain(it) },
            )
    }

    fun toDomain(): FileTree =
        FileTree(
            id = id,
            name = name,
            type = type,
            path = path,
            children = children.map { it.toDomain() },
        )
}

/**
 * MongoDB Document (Infrastructure concern)
 * Represents a user's file tree structure with an array of root nodes
 */
@Document(collection = "file_trees")
data class FileTreeDocument(
    @Id
    val id: String? = null,
    val userId: String,
    val trees: List<FileTreeNode> = emptyList(),
) {
    companion object {
        fun fromDomain(
            userId: String,
            domains: List<FileTree>,
            id: String? = null,
        ): FileTreeDocument =
            FileTreeDocument(
                id = id,
                userId = userId,
                trees = domains.map { FileTreeNode.fromDomain(it) },
            )
    }

    fun toDomain(): List<FileTree> = trees.map { it.toDomain() }
}
