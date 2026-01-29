package com.secubox.api.presentation.rest.dto

data class TreeUpdateCommand(
    val id: String,
    val name: String,
    val path: String,
    val file: FileInfo? = null,
    val childrens: List<TreeUpdateCommand>? = null
)

data class FileInfo(
    val name: String,
    val size: Long,
    val type: String
)
