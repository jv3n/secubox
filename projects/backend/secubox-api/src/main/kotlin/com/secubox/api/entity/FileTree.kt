package com.secubox.api.entity

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "file_trees")
data class FileTree(
    @Id
    val id: String? = null,
    val name: String,
    val type: NodeType,
    val hash: String? = null,
    val size: Long? = null,
    val children: List<FileTree> = emptyList(),
    val createdAt: Instant = Instant.now(),
    val updatedAt: Instant = Instant.now(),
    val version: Int = 1
)

enum class NodeType {
    FILE, FOLDER
}
