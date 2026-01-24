package com.secubox.api.controller

import com.secubox.api.entity.FileMetadata
import com.secubox.api.service.FileStorageService
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.codec.multipart.FilePart
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/files")
class FileUploadController(
    private val fileStorageService: FileStorageService
) {

    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    suspend fun uploadFile(@RequestPart("file") filePart: FilePart): ResponseEntity<FileMetadata> {
        val fileName = filePart.filename()
        val mimeType = filePart.headers().contentType?.toString() ?: "application/octet-stream"

        // Read file data
        val fileData = filePart.content().collectList().map { dataBuffers ->
            val bytes = ByteArray(dataBuffers.sumOf { it.readableByteCount() })
            var offset = 0
            dataBuffers.forEach { buffer ->
                buffer.read(bytes, offset, buffer.readableByteCount())
                offset += buffer.readableByteCount()
            }
            bytes
        }.awaitSingle()

        val metadata = fileStorageService.storeFile(fileName, fileData, mimeType)

        return ResponseEntity.status(HttpStatus.CREATED).body(metadata)
    }

    @GetMapping("/{hash}")
    suspend fun downloadFile(@PathVariable hash: String): ResponseEntity<ByteArray> {
        val fileData = fileStorageService.getFile(hash)
        return fileData?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }
}
