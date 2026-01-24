package com.secubox.api.infrastructure.persistence

import com.secubox.api.domain.file.model.FileMetadata
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "file_metadata")
data class FileMetadataDocument(
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
) {
    companion object {
        fun fromDomain(domain: FileMetadata): FileMetadataDocument {
            return FileMetadataDocument(
                id = domain.id,
                hash = domain.hash,
                originalName = domain.originalName,
                size = domain.size,
                mimeType = domain.mimeType,
                storagePath = domain.storagePath,
                uploadedAt = domain.uploadedAt,
                referenceCount = domain.referenceCount
            )
        }
    }

    fun toDomain(): FileMetadata {
        return FileMetadata(
            id = id,
            hash = hash,
            originalName = originalName,
            size = size,
            mimeType = mimeType,
            storagePath = storagePath,
            uploadedAt = uploadedAt,
            referenceCount = referenceCount
        )
    }
}
