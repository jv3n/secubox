import { Injectable } from '@angular/core';
import { TreeObject } from './file-system.model';

@Injectable({ providedIn: 'root' })
export class FileSystemHelper {
  findParent(obj: TreeObject | null, tree: TreeObject[]): TreeObject | null {
    for (const node of tree) {
      if (node.children?.some((child) => child.id === obj?.id)) {
        return node;
      }
      if (node.children?.length) {
        const parent = this.findParent(obj, node.children);
        if (parent) return parent;
      }
    }
    return null;
  }

  findParentWithoutTarget(columnIndex: number, selectedObj: TreeObject | null, tree: TreeObject[]): TreeObject | null {
    if (!selectedObj || columnIndex === 0) {
      return null;
    }

    let currentChildren = tree;
    let current: TreeObject | null = null;

    // build the path stack from root to selectedObj
    const pathStack: TreeObject[] = [];
    let node: TreeObject | null = selectedObj;
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
      currentChildren = current.children ?? [];
    }

    return current ?? this.findParent(selectedObj, tree);
  }
}
