package com.secubox.api.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "storage")
data class StorageProperties(
    val basePath: String = "./storage",
    val maxFileSize: Long = 104857600 // 100MB
)
