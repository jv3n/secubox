import { beforeEach, describe, expect, it } from 'vitest';
import { FileSystemHelper } from '../file-system.helper';
import { TreeObject, TreeObjectType } from '../file-system.model';

describe('FileSystemHelper', () => {
  let helper: FileSystemHelper;
  let tree: TreeObject[];

  beforeEach(() => {
    helper = new FileSystemHelper();

    tree = [
      {
        id: 'root1',
        type: TreeObjectType.FOLDER,
        name: 'Documents',
        path: '/',
        children: [
          {
            id: 'doc1',
            type: TreeObjectType.FOLDER,
            name: 'Projet A',
            path: '/Documents',
            children: [
              {
                id: 'file1',
                type: TreeObjectType.FILE,
                name: 'README.md',
                path: '/Projet A',
              },
            ],
          },
          {
            id: 'doc2',
            type: TreeObjectType.FOLDER,
            name: 'Projet B',
            path: '/Documents',
            children: [],
          },
        ],
      },
      {
        id: 'root2',
        type: TreeObjectType.FOLDER,
        name: 'Travail',
        path: '/',
        children: [
          {
            id: 'file2',
            type: TreeObjectType.FILE,
            name: 'Note.txt',
            path: '/Travail',
          },
        ],
      },
    ];
  });

  describe('findParent', () => {
    it('should find parent of a nested folder', () => {
      const doc1 = tree[0].children![0]; // Projet A
      const parent = helper.findParent(doc1, tree);
      expect(parent).toBe(tree[0]);
    });

    it('should find parent of a nested file', () => {
      const file1 = tree[0].children![0].children![0]; // README.md
      const parent = helper.findParent(file1, tree);
      expect(parent).toBe(tree[0].children![0]);
    });

    it('should return null if object is at root level', () => {
      const root = tree[0];
      const parent = helper.findParent(root, tree);
      expect(parent).toBeNull();
    });

    it('should return null if object is not in the tree', () => {
      const unknown: TreeObject = { id: 'unknown', type: TreeObjectType.FOLDER, name: 'Unknown', path: '/' };
      const parent = helper.findParent(unknown, tree);
      expect(parent).toBeNull();
    });

    it('should handle null input', () => {
      const parent = helper.findParent(null, tree);
      expect(parent).toBeNull();
    });
  });

  describe('findParentWithoutTarget', () => {
    it('should return null if selectedObj is null', () => {
      const parent = helper.findParentWithoutTarget(1, null, tree);
      expect(parent).toBeNull();
    });

    it('should return null if columnIndex is 0 (root column)', () => {
      const selectedObj = tree[0].children![0]; // Projet A
      const parent = helper.findParentWithoutTarget(0, selectedObj, tree);
      expect(parent).toBeNull();
    });

    it('should find parent for a nested file in the last empty column', () => {
      const selectedObj = tree[0].children![0].children![0]; // README.md
      const columnIndex = 3;
      const parent = helper.findParentWithoutTarget(columnIndex, selectedObj, tree);

      expect(parent).not.toBeNull();
      expect(parent?.id).toBe('file1');
      expect(parent?.name).toBe('README.md');
    });

    it('should fallback to immediate parent if columnIndex exceeds path depth', () => {
      const selectedObj = tree[0].children![0].children![0]; // README.md
      const columnIndex = 10; // colonne trop profonde
      const parent = helper.findParentWithoutTarget(columnIndex, selectedObj, tree);
      expect(parent).toBe(tree[0].children![0]); // parent attendu = Projet A
    });

    it('should handle object not in tree', () => {
      const selectedObj: TreeObject = { id: 'unknown', type: TreeObjectType.FOLDER, name: 'X', path: '/' };
      const parent = helper.findParentWithoutTarget(1, selectedObj, tree);
      expect(parent).toBeNull();
    });
  });
});
