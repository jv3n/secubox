package com.secubox.api.domain.filetree.model

/**
 * FileTree Node
 * Represents a node in a hierarchical file/folder structure
 */
data class FileTree(
    val id: String? = null,
    val name: String,
    val type: NodeType,
    val path: String? = null,
    val children: List<FileTree> = emptyList(),
) {
    init {
        require(name.isNotBlank()) { "File tree name cannot be blank" }
        if (type == NodeType.FILE) {
            require(children.isEmpty()) { "Files cannot have children" }
        }
    }

    fun isFolder(): Boolean = type == NodeType.FOLDER

    fun isFile(): Boolean = type == NodeType.FILE

    fun addChild(child: FileTree): FileTree {
        require(isFolder()) { "Cannot add children to a file" }
        return copy(
            children = children + child,
        )
    }

    fun removeChild(childId: String): FileTree {
        require(isFolder()) { "Cannot remove children from a file" }
        return copy(
            children = children.filterNot { it.id == childId },
        )
    }

    companion object {
        fun createFolder(
            name: String,
            path: String,
        ): FileTree =
            FileTree(
                name = name,
                type = NodeType.FOLDER,
                path = path,
            )

        fun createFile(
            name: String,
            path: String,
        ): FileTree =
            FileTree(
                name = name,
                type = NodeType.FILE,
                path = path,
            )
    }
}
