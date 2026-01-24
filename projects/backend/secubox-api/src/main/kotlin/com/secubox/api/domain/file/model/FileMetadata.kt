package com.secubox.api.domain.file.model

import java.time.Instant

/**
 * FileMetadata Entity (Domain Model)
 * Represents metadata for stored files with deduplication support
 */
data class FileMetadata(
    val id: String? = null,
    val hash: String,
    val originalName: String,
    val size: Long,
    val mimeType: String,
    val storagePath: String,
    val uploadedAt: Instant = Instant.now(),
    val referenceCount: Int = 1
) {
    init {
        require(hash.isNotBlank()) { "Hash cannot be blank" }
        require(originalName.isNotBlank()) { "Original name cannot be blank" }
        require(size > 0) { "Size must be positive" }
        require(referenceCount > 0) { "Reference count must be positive" }
    }

    fun incrementReference(): FileMetadata {
        return copy(referenceCount = referenceCount + 1)
    }

    fun decrementReference(): FileMetadata {
        require(referenceCount > 0) { "Cannot decrement reference count below zero" }
        return copy(referenceCount = referenceCount - 1)
    }

    fun canBeDeleted(): Boolean = referenceCount == 0
}
