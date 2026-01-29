package com.secubox.api.presentation.rest

import com.secubox.api.application.filetree.FileTreeApplicationService
import com.secubox.api.application.filetree.dto.FileTreeDTO
import com.secubox.api.presentation.rest.dto.TreeUpdateCommand
import kotlinx.coroutines.flow.Flow
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * REST Controller (Presentation Layer)
 * Exposes HTTP endpoints for file tree operations
 */
@RestController
@RequestMapping("/file-tree")
@CrossOrigin(origins = ["http://localhost:4200", "http://localhost:4201"])
class FileTreeController(
    private val fileTreeApplicationService: FileTreeApplicationService
) {

    @GetMapping
    fun getAllTrees(): Flow<FileTreeDTO> {
        return fileTreeApplicationService.getAllTrees()
    }

    @GetMapping("/root")
    suspend fun getRootTree(): ResponseEntity<FileTreeDTO> {
        val rootTree = fileTreeApplicationService.getRootTree()
        return ResponseEntity.ok(rootTree)
    }

    @PutMapping("/root")
    suspend fun updateRootTree(@RequestBody command: TreeUpdateCommand): ResponseEntity<FileTreeDTO> {
        val updated = fileTreeApplicationService.updateRootTree(command)
        return ResponseEntity.ok(updated)
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

    @PutMapping("/{id}")
    suspend fun updateTree(
        @PathVariable id: String,
        @RequestBody command: TreeUpdateCommand
    ): ResponseEntity<FileTreeDTO> {
        val updated = fileTreeApplicationService.updateTree(id, command)
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
