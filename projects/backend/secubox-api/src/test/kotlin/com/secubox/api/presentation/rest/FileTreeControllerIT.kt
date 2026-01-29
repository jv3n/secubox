package com.secubox.api.presentation.rest

import com.secubox.api.application.filetree.dto.FileTreeDTO
import com.secubox.api.domain.filetree.model.NodeType
import com.secubox.api.infrastructure.persistence.FileTreeMongoRepository
import com.secubox.api.presentation.rest.dto.TreeObjectUpdateCommand
import com.secubox.api.presentation.rest.dto.TreeUpdateCommand
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
        val mongoDBContainer =
            MongoDBContainer(DockerImageName.parse("mongo:8.0"))
                .withExposedPorts(27017)

        @JvmStatic
        @DynamicPropertySource
        fun setProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.data.mongodb.uri") { mongoDBContainer.replicaSetUrl }
        }
    }

    @AfterEach
    fun cleanup(): Unit =
        runBlocking {
            fileTreeRepository.deleteAll().block()
        }

    @Test
    fun `should get root tree and create default if not exists`() {
        webTestClient
            .get()
            .uri("/file-tree")
            .exchange()
            .expectStatus()
            .isOk
            .expectBody()
            .jsonPath("$.id")
            .isNotEmpty
            .jsonPath("$.tree")
            .isArray
            .jsonPath("$.tree[0].name")
            .isEqualTo("RH")
            .jsonPath("$.tree[0].type")
            .isEqualTo("FOLDER")
            .jsonPath("$.tree[0].children[0].name")
            .isEqualTo("Administration")
            .jsonPath("$.tree[0].children[1].name")
            .isEqualTo("Bulletins de paie")
    }

    @Test
    fun `should get tree by userId`() {
        // Given: root tree exists (creates default-user tree)
        val rootResponse =
            webTestClient
                .get()
                .uri("/file-tree")
                .exchange()
                .expectStatus()
                .isOk
                .returnResult(FileTreeDTO::class.java)
                .responseBody
                .blockFirst()!!

        // When: getting by userId
        webTestClient
            .get()
            .uri("/file-tree/default-user")
            .exchange()
            .expectStatus()
            .isOk
            .expectBody()
            .jsonPath("$.id")
            .isEqualTo(rootResponse.id)
            .jsonPath("$.tree[0].name")
            .isEqualTo("RH")
    }

    @Test
    fun `should return 404 when tree not found by userId`() {
        webTestClient
            .get()
            .uri("/file-tree/nonexistent-user")
            .exchange()
            .expectStatus()
            .isNotFound
    }

    @Test
    fun `should update existing tree`() {
        // Given: root tree exists
        val rootResponse =
            webTestClient
                .get()
                .uri("/file-tree")
                .exchange()
                .expectStatus()
                .isOk
                .returnResult(FileTreeDTO::class.java)
                .responseBody
                .blockFirst()!!

        // When: updating the tree
        val updateCommand =
            TreeUpdateCommand(
                id = rootResponse.id,
                tree =
                    listOf(
                        TreeObjectUpdateCommand(
                            id = null,
                            type = NodeType.FOLDER,
                            name = "Updated Folder",
                            path = "/",
                            children =
                                listOf(
                                    TreeObjectUpdateCommand(
                                        id = null,
                                        type = NodeType.FILE,
                                        name = "test.txt",
                                        path = "/Updated Folder",
                                        children = null,
                                    ),
                                ),
                        ),
                    ),
            )

        webTestClient
            .put()
            .uri("/file-tree")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(updateCommand)
            .exchange()
            .expectStatus()
            .isOk
            .expectBody()
            .jsonPath("$.tree[0].name")
            .isEqualTo("Updated Folder")
            .jsonPath("$.tree[0].path")
            .isEqualTo("/")
            .jsonPath("$.tree[0].children[0].name")
            .isEqualTo("test.txt")
            .jsonPath("$.tree[0].children[0].path")
            .isEqualTo("/Updated Folder")
            .jsonPath("$.tree[0].children[0].type")
            .isEqualTo("FILE")

        // Then: verify tree was persisted correctly
        webTestClient
            .get()
            .uri("/file-tree/default-user")
            .exchange()
            .expectStatus()
            .isOk
            .expectBody()
            .jsonPath("$.tree[0].name")
            .isEqualTo("Updated Folder")
            .jsonPath("$.tree[0].path")
            .isEqualTo("/")
            .jsonPath("$.tree[0].children[0].name")
            .isEqualTo("test.txt")
            .jsonPath("$.tree[0].children[0].path")
            .isEqualTo("/Updated Folder")
            .jsonPath("$.tree[0].children[0].type")
            .isEqualTo("FILE")
    }
}
