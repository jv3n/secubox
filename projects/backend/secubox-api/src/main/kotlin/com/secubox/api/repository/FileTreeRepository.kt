package com.secubox.api.repository

import com.secubox.api.entity.FileTree
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository

@Repository
interface FileTreeRepository : ReactiveMongoRepository<FileTree, String> {
    suspend fun findByName(name: String): FileTree?
}
