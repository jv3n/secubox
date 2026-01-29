package com.secubox.api.presentation.rest.dto

import com.secubox.api.domain.filetree.model.NodeType

data class TreeUpdateCommand(
    val id: String,
    val tree: List<TreeObjectUpdateCommand>,
)

data class TreeObjectUpdateCommand(
    val id: String?,
    val type: NodeType,
    val name: String,
    val path: String,
    val file: FileInfo? = null,
    val children: List<TreeObjectUpdateCommand>? = null,
)

data class FileInfo(
    val name: String,
    val size: Long,
    val type: String,
)
