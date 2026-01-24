package com.secubox.api.controller

import com.secubox.api.entity.FileTree
import com.secubox.api.service.FileTreeService
import kotlinx.coroutines.flow.Flow
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/file-tree")
class FileTreeController(
    private val fileTreeService: FileTreeService
) {

    @PostMapping
    suspend fun createTree(@RequestBody fileTree: FileTree): ResponseEntity<FileTree> {
        val created = fileTreeService.createTree(fileTree)
        return ResponseEntity.status(HttpStatus.CREATED).body(created)
    }

    @GetMapping("/{id}")
    suspend fun getTree(@PathVariable id: String): ResponseEntity<FileTree> {
        val tree = fileTreeService.getTree(id)
        return tree?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }

    @GetMapping
    fun getAllTrees(): Flow<FileTree> {
        return fileTreeService.getAllTrees()
    }

    @PutMapping("/{id}")
    suspend fun updateTree(
        @PathVariable id: String,
        @RequestBody fileTree: FileTree
    ): ResponseEntity<FileTree> {
        val updated = fileTreeService.updateTree(id, fileTree)
        return updated?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    suspend fun deleteTree(@PathVariable id: String): ResponseEntity<Void> {
        val deleted = fileTreeService.deleteTree(id)
        return if (deleted) ResponseEntity.noContent().build()
            else ResponseEntity.notFound().build()
    }
}
