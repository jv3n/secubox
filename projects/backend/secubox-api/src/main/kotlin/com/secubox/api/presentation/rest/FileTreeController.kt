package com.secubox.api.presentation.rest

import com.secubox.api.application.filetree.FileTreeApplicationService
import com.secubox.api.application.filetree.dto.FileTreeDTO
import com.secubox.api.presentation.rest.dto.TreeUpdateCommand
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * REST Controller (Presentation Layer)
 * Exposes HTTP endpoints for file tree operations
 */
@RestController
@RequestMapping("/file-tree")
@CrossOrigin(origins = ["http://localhost:4200", "http://localhost:4201"])
class FileTreeController(
    private val fileTreeApplicationService: FileTreeApplicationService,
) {
    @GetMapping
    suspend fun getRootTree(): ResponseEntity<FileTreeDTO> {
        val rootTree = fileTreeApplicationService.getRootTree()
        return ResponseEntity.ok(rootTree)
    }

    @GetMapping("/{userId}")
    suspend fun getTree(
        @PathVariable userId: String,
    ): ResponseEntity<FileTreeDTO> {
        val tree = fileTreeApplicationService.getTree(userId)
        return tree?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }

    @PutMapping
    suspend fun updateTree(
        @RequestBody command: TreeUpdateCommand,
    ): ResponseEntity<FileTreeDTO> {
        val updatedTree = fileTreeApplicationService.updateTree(command.id, command.tree)
        return updatedTree?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }
}
