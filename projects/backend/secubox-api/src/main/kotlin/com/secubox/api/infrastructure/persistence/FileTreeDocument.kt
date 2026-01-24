package com.secubox.api.infrastructure.persistence

import com.secubox.api.domain.filetree.model.FileTree
import com.secubox.api.domain.filetree.model.NodeType
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

/**
 * MongoDB Document (Infrastructure concern)
 * Maps domain model to persistence
 */
@Document(collection = "file_trees")
data class FileTreeDocument(
    @Id
    val id: String? = null,
    val name: String,
    val type: NodeType,
    val hash: String? = null,
    val size: Long? = null,
    val children: List<FileTreeDocument> = emptyList(),
    val createdAt: Instant = Instant.now(),
    val updatedAt: Instant = Instant.now(),
    val version: Int = 1
) {
    companion object {
        fun fromDomain(domain: FileTree): FileTreeDocument {
            return FileTreeDocument(
                id = domain.id,
                name = domain.name,
                type = domain.type,
                hash = domain.hash,
                size = domain.size,
                children = domain.children.map { fromDomain(it) },
                createdAt = domain.createdAt,
                updatedAt = domain.updatedAt,
                version = domain.version
            )
        }
    }

    fun toDomain(): FileTree {
        return FileTree(
            id = id,
            name = name,
            type = type,
            hash = hash,
            size = size,
            children = children.map { it.toDomain() },
            createdAt = createdAt,
            updatedAt = updatedAt,
            version = version
        )
    }
}
