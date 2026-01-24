package com.secubox.api.entity

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "file_metadata")
data class FileMetadata(
    @Id
    val id: String? = null,

    @Indexed(unique = true)
    val hash: String,

    val originalName: String,
    val size: Long,
    val mimeType: String,
    val storagePath: String,
    val uploadedAt: Instant = Instant.now(),
    val referenceCount: Int = 1
)
