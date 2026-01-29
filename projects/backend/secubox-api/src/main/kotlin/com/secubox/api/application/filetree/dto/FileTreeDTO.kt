package com.secubox.api.application.filetree.dto

import com.secubox.api.domain.filetree.model.FileTree
import com.secubox.api.domain.filetree.model.NodeType

data class FileTreeNodeDTO(
    val id: String? = null,
    val name: String,
    val type: NodeType,
    val path: String? = null,
    val children: List<FileTreeNodeDTO> = emptyList(),
) {
    companion object {
        fun fromDomain(domain: FileTree): FileTreeNodeDTO =
            FileTreeNodeDTO(
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

data class FileTreeDTO(
    val id: String,
    val tree: List<FileTreeNodeDTO>,
) {
    companion object {
        fun fromDomain(
            id: String,
            domains: List<FileTree>,
        ): FileTreeDTO =
            FileTreeDTO(
                id = id,
                tree = domains.map { FileTreeNodeDTO.fromDomain(it) },
            )
    }
}
