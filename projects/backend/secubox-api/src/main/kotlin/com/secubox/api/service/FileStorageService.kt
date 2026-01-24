package com.secubox.api.service

import com.secubox.api.config.StorageProperties
import com.secubox.api.entity.FileMetadata
import com.secubox.api.repository.FileMetadataRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.withContext
import org.springframework.stereotype.Service
import java.io.File
import java.security.MessageDigest
import java.time.Instant

@Service
class FileStorageService(
    private val storageProperties: StorageProperties,
    private val fileMetadataRepository: FileMetadataRepository
) {

    suspend fun storeFile(fileName: String, fileData: ByteArray, mimeType: String): FileMetadata {
        val hash = calculateHash(fileData)

        // Check if file already exists (deduplication)
        val existingFile = fileMetadataRepository.findByHash(hash)
        if (existingFile != null) {
            // Increment reference count
            val updated = existingFile.copy(referenceCount = existingFile.referenceCount + 1)
            return fileMetadataRepository.save(updated).awaitSingle()
        }

        // Store new file
        val storagePath = "${storageProperties.basePath}/$hash"
        saveToFileSystem(storagePath, fileData)

        val metadata = FileMetadata(
            hash = hash,
            originalName = fileName,
            size = fileData.size.toLong(),
            mimeType = mimeType,
            storagePath = storagePath,
            uploadedAt = Instant.now()
        )

        return fileMetadataRepository.save(metadata).awaitSingle()
    }

    suspend fun calculateHash(data: ByteArray): String = withContext(Dispatchers.IO) {
        val digest = MessageDigest.getInstance("SHA-256")
        val hashBytes = digest.digest(data)
        hashBytes.joinToString("") { "%02x".format(it) }
    }

    private suspend fun saveToFileSystem(path: String, data: ByteArray) = withContext(Dispatchers.IO) {
        val file = File(path)
        file.parentFile?.mkdirs()
        file.writeBytes(data)
    }

    suspend fun getFile(hash: String): ByteArray? = withContext(Dispatchers.IO) {
        val metadata = fileMetadataRepository.findByHash(hash) ?: return@withContext null
        val file = File(metadata.storagePath)
        if (file.exists()) file.readBytes() else null
    }
}
