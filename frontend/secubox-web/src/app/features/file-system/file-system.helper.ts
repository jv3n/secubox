import { Injectable } from '@angular/core';
import { FileSystemObject } from './file-system.model';

@Injectable({ providedIn: 'root' })
export class FileSystemHelper {
  findParent(obj: FileSystemObject | null, tree: FileSystemObject[]): FileSystemObject | null {
    for (const node of tree) {
      if (node.childrens?.some((child) => child.id === obj?.id)) {
        return node;
      }
      if (node.childrens?.length) {
        const parent = this.findParent(obj, node.childrens);
        if (parent) return parent;
      }
    }
    return null;
  }

  findParentWithoutTarget(
    columnIndex: number,
    selectedObj: FileSystemObject | null,
    tree: FileSystemObject[],
  ): FileSystemObject | null {
    if (!selectedObj || columnIndex === 0) {
      return null;
    }

    let currentChildren = tree;
    let current: FileSystemObject | null = null;

    // build the path stack from root to selectedObj
    const pathStack: FileSystemObject[] = [];
    let node: FileSystemObject | null = selectedObj;
    while (node) {
      pathStack.unshift(node);
      node = this.findParent(node, tree);
    }

    // now pathStack[0] = root, pathStack[last] = selectedObj
    for (let i = 0; i < columnIndex; i++) {
      current = currentChildren.find((f) => f.id === pathStack[i].id) ?? null;
      if (!current) {
        break;
      }
      currentChildren = current.childrens ?? [];
    }

    return current ?? this.findParent(selectedObj, tree);
  }
}
