package com.secubox.api.presentation.rest

import com.secubox.api.application.filetree.FileTreeApplicationService
import com.secubox.api.application.filetree.dto.FileTreeDTO
import kotlinx.coroutines.flow.Flow
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * REST Controller (Presentation Layer)
 * Exposes HTTP endpoints for file tree operations
 */
@RestController
@RequestMapping("/api/file-tree")
class FileTreeController(
    private val fileTreeApplicationService: FileTreeApplicationService
) {

    @GetMapping("/root")
    suspend fun getRootTree(): ResponseEntity<FileTreeDTO> {
        val rootTree = fileTreeApplicationService.getRootTree()
        return ResponseEntity.ok(rootTree)
    }

    @PostMapping
    suspend fun createTree(@RequestBody dto: FileTreeDTO): ResponseEntity<FileTreeDTO> {
        val created = fileTreeApplicationService.createTree(dto)
        return ResponseEntity.status(HttpStatus.CREATED).body(created)
    }

    @GetMapping("/{id}")
    suspend fun getTree(@PathVariable id: String): ResponseEntity<FileTreeDTO> {
        val tree = fileTreeApplicationService.getTree(id)
        return tree?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }

    @GetMapping
    fun getAllTrees(): Flow<FileTreeDTO> {
        return fileTreeApplicationService.getAllTrees()
    }

    @PutMapping("/{id}")
    suspend fun updateTree(
        @PathVariable id: String,
        @RequestBody dto: FileTreeDTO
    ): ResponseEntity<FileTreeDTO> {
        val updated = fileTreeApplicationService.updateTree(id, dto)
        return updated?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    suspend fun deleteTree(@PathVariable id: String): ResponseEntity<Void> {
        val deleted = fileTreeApplicationService.deleteTree(id)
        return if (deleted) ResponseEntity.noContent().build()
            else ResponseEntity.notFound().build()
    }
}
