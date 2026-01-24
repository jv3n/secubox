# DDD Architecture - Secubox Backend

## Structure Overview

This backend follows **Domain-Driven Design (DDD)** principles with clean architecture layers.

```
com.secubox.api/
├── domain/              # Business logic (pure, framework-agnostic)
├── application/         # Use cases & orchestration
├── infrastructure/      # Technical implementations
└── presentation/        # API controllers & DTOs
```

---

## Layers Description

### 1. Domain Layer (`domain/`)
**Pure business logic, no framework dependencies**

```
domain/
├── filetree/
│   ├── model/                    # Domain entities & value objects
│   │   ├── FileTree.kt           # Aggregate Root
│   │   └── NodeType.kt           # Value Object (Enum)
│   ├── repository/               # Repository interfaces (ports)
│   │   └── FileTreeRepository.kt
│   └── service/                  # Domain services
│       └── FileTreeDomainService.kt
```

**Key principles:**
- Contains core business rules
- Framework-agnostic (no Spring, no MongoDB)
- Entities define invariants and business methods
- Repository interfaces (ports) - implemented by infrastructure

### 2. Application Layer (`application/`)
**Use cases & application services**

```
application/
└── filetree/
    ├── FileTreeApplicationService.kt  # Orchestrates use cases
    └── dto/
        └── FileTreeDTO.kt             # Data transfer objects
```

**Responsibilities:**
- Orchestrate domain objects
- Transaction boundaries
- Convert between domain and DTOs
- Coordinate multiple aggregates

### 3. Infrastructure Layer (`infrastructure/`)
**Technical implementations (adapters)**

```
infrastructure/
├── persistence/
│   ├── FileTreeDocument.kt           # MongoDB document
│   ├── FileTreeMongoRepository.kt    # Spring Data interface
│   └── FileTreeRepositoryImpl.kt     # Domain repository implementation
├── storage/
│   └── LocalFileStorageService.kt
└── config/
    ├── WebConfig.kt
    └── StorageProperties.kt
```

**Responsibilities:**
- Implement domain repository interfaces
- Database mapping (domain ↔ persistence)
- External service integrations
- Framework configurations

### 4. Presentation Layer (`presentation/`)
**REST API controllers**

```
presentation/
└── rest/
    ├── FileTreeController.kt
    └── FileUploadController.kt
```

**Responsibilities:**
- HTTP request/response handling
- Call application services
- Return DTOs (never domain objects directly)

---

## Data Flow

```
HTTP Request
    ↓
[Presentation] Controller
    ↓
[Application] Application Service
    ↓
[Domain] Domain Service + Aggregate Root
    ↓
[Domain] Repository Interface
    ↓
[Infrastructure] Repository Implementation
    ↓
MongoDB
```

---

## Key DDD Patterns Used

### Aggregate Root
`FileTree` is an aggregate root that maintains consistency boundaries for the file tree structure.

```kotlin
// domain/filetree/model/FileTree.kt
data class FileTree(...) {
    init {
        require(name.isNotBlank()) { "Name cannot be blank" }
    }

    fun addChild(child: FileTree): FileTree {
        require(isFolder()) { "Cannot add children to a file" }
        return copy(children = children + child)
    }
}
```

### Repository Pattern
Domain defines the interface, infrastructure implements it.

```kotlin
// domain/filetree/repository/FileTreeRepository.kt
interface FileTreeRepository {  // Port
    suspend fun save(fileTree: FileTree): FileTree
}

// infrastructure/persistence/FileTreeRepositoryImpl.kt
class FileTreeRepositoryImpl : FileTreeRepository {  // Adapter
    override suspend fun save(fileTree: FileTree): FileTree { ... }
}
```

### Domain Service
Business logic that doesn't naturally fit in an entity.

```kotlin
// domain/filetree/service/FileTreeDomainService.kt
class FileTreeDomainService {
    fun createDefaultRHStructure(): FileTree { ... }
    fun canMove(source: FileTree, target: FileTree): Boolean { ... }
}
```

### Application Service
Coordinates use cases and transactions.

```kotlin
// application/filetree/FileTreeApplicationService.kt
class FileTreeApplicationService {
    suspend fun getRootTree(): FileTreeDTO {
        // 1. Query repository
        // 2. Use domain service if needed
        // 3. Convert to DTO
        // 4. Return
    }
}
```

---

## Benefits

✅ **Testability**: Domain logic can be tested without framework
✅ **Maintainability**: Clear separation of concerns
✅ **Flexibility**: Easy to swap infrastructure (MongoDB → PostgreSQL)
✅ **Business-focused**: Domain model reflects business language
✅ **Framework-independent**: Core business logic has no Spring dependencies

---

## Dependencies Direction

```
Presentation → Application → Domain ← Infrastructure
                                ↑
                          (implements)
```

**Rule**: Dependencies always point inward (toward domain).
Infrastructure implements domain interfaces (Dependency Inversion Principle).

---

## Example: Adding a New Feature

### 1. Define domain model
```kotlin
// domain/filetree/model/FileTree.kt
fun rename(newName: String): FileTree {
    require(newName.isNotBlank()) { "Name cannot be blank" }
    return copy(name = newName, updatedAt = Instant.now())
}
```

### 2. Add to application service
```kotlin
// application/filetree/FileTreeApplicationService.kt
suspend fun renameTree(id: String, newName: String): FileTreeDTO? {
    val tree = fileTreeRepository.findById(id) ?: return null
    val renamed = tree.rename(newName)
    val saved = fileTreeRepository.save(renamed)
    return FileTreeDTO.fromDomain(saved)
}
```

### 3. Expose via controller
```kotlin
// presentation/rest/FileTreeController.kt
@PatchMapping("/{id}/rename")
suspend fun renameTree(
    @PathVariable id: String,
    @RequestBody request: RenameRequest
): ResponseEntity<FileTreeDTO> { ... }
```

---

## Testing Strategy

- **Domain**: Unit tests (pure Kotlin, no framework)
- **Application**: Integration tests (mock repositories)
- **Infrastructure**: Integration tests (Testcontainers + MongoDB)
- **Presentation**: E2E tests (MockMvc)

---

## Migration from Old Structure

Old files are deprecated and will be removed:
- `entity/FileTree.kt` → Moved to `domain/filetree/model/`
- `service/FileTreeService.kt` → Split into application + domain services
- `repository/FileTreeRepository.kt` → Moved to `domain/` (interface) + `infrastructure/` (impl)
- `controller/FileTreeController.kt` → Moved to `presentation/rest/`
