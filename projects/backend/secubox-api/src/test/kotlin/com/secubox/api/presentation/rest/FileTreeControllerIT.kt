package com.secubox.api.presentation.rest

import com.secubox.api.application.filetree.dto.FileTreeDTO
import com.secubox.api.domain.filetree.model.NodeType
import com.secubox.api.infrastructure.persistence.FileTreeMongoRepository
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.reactive.server.WebTestClient
import org.testcontainers.containers.MongoDBContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import org.testcontainers.utility.DockerImageName

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
@Testcontainers
class FileTreeControllerIT {

    @Autowired
    private lateinit var webTestClient: WebTestClient

    @Autowired
    private lateinit var fileTreeRepository: FileTreeMongoRepository

    companion object {
        @Container
        val mongoDBContainer = MongoDBContainer(DockerImageName.parse("mongo:8.0"))
            .withExposedPorts(27017)

        @JvmStatic
        @DynamicPropertySource
        fun setProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.data.mongodb.uri") { mongoDBContainer.replicaSetUrl }
        }
    }

    @AfterEach
    fun cleanup(): Unit = runBlocking {
        fileTreeRepository.deleteAll()
    }

    @Test
    fun `should create a new file tree`() {
        val fileTreeDTO = FileTreeDTO(
            name = "root",
            type = NodeType.FOLDER,
            children = listOf(
                FileTreeDTO(
                    name = "file1.txt",
                    type = NodeType.FILE,
                    hash = "abc123",
                    size = 1024
                )
            )
        )

        webTestClient.post()
            .uri("/api/file-tree")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(fileTreeDTO)
            .exchange()
            .expectStatus().isCreated
            .expectBody()
            .jsonPath("$.id").isNotEmpty
            .jsonPath("$.name").isEqualTo("root")
            .jsonPath("$.type").isEqualTo("FOLDER")
            .jsonPath("$.children[0].name").isEqualTo("file1.txt")
    }

    @Test
    fun `should get root tree`() {
        // When: getting root tree (creates default if doesn't exist)
        webTestClient.get()
            .uri("/api/file-tree/root")
            .exchange()
            .expectStatus().isOk
            .expectBody()
            .jsonPath("$.id").isNotEmpty
            .jsonPath("$.name").exists()
            .jsonPath("$.type").exists()
    }

    @Test
    fun `should get tree by id`() {
        // Given: a tree exists
        val fileTreeDTO = FileTreeDTO(
            name = "test-folder",
            type = NodeType.FOLDER
        )

        val createdId = webTestClient.post()
            .uri("/api/file-tree")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(fileTreeDTO)
            .exchange()
            .expectStatus().isCreated
            .returnResult(FileTreeDTO::class.java)
            .responseBody
            .blockFirst()!!
            .id

        // When: getting by ID
        webTestClient.get()
            .uri("/api/file-tree/$createdId")
            .exchange()
            .expectStatus().isOk
            .expectBody()
            .jsonPath("$.id").isEqualTo(createdId!!)
            .jsonPath("$.name").isEqualTo("test-folder")
    }

    @Test
    fun `should return 404 when tree not found by id`() {
        webTestClient.get()
            .uri("/api/file-tree/nonexistent-id")
            .exchange()
            .expectStatus().isNotFound
    }

    @Test
    fun `should get all trees`() {
        // Given: multiple trees exist
        val tree1 = FileTreeDTO(name = "folder1", type = NodeType.FOLDER)
        val tree2 = FileTreeDTO(name = "folder2", type = NodeType.FOLDER)

        webTestClient.post().uri("/api/file-tree")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(tree1)
            .exchange()
            .expectStatus().isCreated

        webTestClient.post().uri("/api/file-tree")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(tree2)
            .exchange()
            .expectStatus().isCreated

        // When: getting all trees
        webTestClient.get()
            .uri("/api/file-tree")
            .exchange()
            .expectStatus().isOk
            .expectBodyList(FileTreeDTO::class.java)
            .hasSize(2)
    }

    @Test
    fun `should update existing tree`() {
        // Given: a tree exists
        val originalTree = FileTreeDTO(
            name = "original-name",
            type = NodeType.FOLDER
        )

        val createdId = webTestClient.post()
            .uri("/api/file-tree")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(originalTree)
            .exchange()
            .expectStatus().isCreated
            .returnResult(FileTreeDTO::class.java)
            .responseBody
            .blockFirst()!!
            .id

        // When: updating the tree
        val updatedTree = FileTreeDTO(
            name = "updated-name",
            type = NodeType.FOLDER
        )

        webTestClient.put()
            .uri("/api/file-tree/$createdId")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(updatedTree)
            .exchange()
            .expectStatus().isOk
            .expectBody()
            .jsonPath("$.id").isEqualTo(createdId!!)
            .jsonPath("$.name").isEqualTo("updated-name")
    }

    @Test
    fun `should return 404 when updating nonexistent tree`() {
        val updatedTree = FileTreeDTO(
            name = "updated-name",
            type = NodeType.FOLDER
        )

        webTestClient.put()
            .uri("/api/file-tree/nonexistent-id")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(updatedTree)
            .exchange()
            .expectStatus().isNotFound
    }

    @Test
    fun `should delete existing tree`() {
        // Given: a tree exists
        val fileTreeDTO = FileTreeDTO(
            name = "to-delete",
            type = NodeType.FOLDER
        )

        val createdId = webTestClient.post()
            .uri("/api/file-tree")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(fileTreeDTO)
            .exchange()
            .expectStatus().isCreated
            .returnResult(FileTreeDTO::class.java)
            .responseBody
            .blockFirst()!!
            .id

        // When: deleting the tree
        webTestClient.delete()
            .uri("/api/file-tree/$createdId")
            .exchange()
            .expectStatus().isNoContent

        // Then: tree should not exist anymore
        webTestClient.get()
            .uri("/api/file-tree/$createdId")
            .exchange()
            .expectStatus().isNotFound
    }

    @Test
    fun `should return 404 when deleting nonexistent tree`() {
        webTestClient.delete()
            .uri("/api/file-tree/nonexistent-id")
            .exchange()
            .expectStatus().isNotFound
    }
}
