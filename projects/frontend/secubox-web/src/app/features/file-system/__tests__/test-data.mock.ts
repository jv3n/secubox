import { TreeObject, TreeObjectType } from '../file-system.model';

/**
 * Mock data dédié aux tests - Simple et stable
 * Ne pas modifier sans mettre à jour les tests correspondants
 */
export const testFileSystemMock: TreeObject[] = [
  {
    id: 'root_a',
    type: TreeObjectType.FOLDER,
    name: 'Folder A',
    path: '/',
    children: [
      {
        id: 'sub_a1',
        type: TreeObjectType.FOLDER,
        name: 'Subfolder A1',
        path: '/Folder A',
        children: [
          {
            id: 'deep_a1',
            type: TreeObjectType.FOLDER,
            name: 'Deep Folder A1',
            path: '/Folder A/Subfolder A1',
            children: [
              {
                id: 'file_deep',
                type: TreeObjectType.FILE,
                name: 'deep-file.txt',
                path: '/Folder A/Subfolder A1/Deep Folder A1',
                file: new File([], 'deep-file.txt', { type: 'text/plain' }),
              },
            ],
          },
        ],
      },
      {
        id: 'sub_a2',
        type: TreeObjectType.FOLDER,
        name: 'Subfolder A2',
        path: '/Folder A',
        children: [],
      },
    ],
  },
  {
    id: 'root_b',
    type: TreeObjectType.FOLDER,
    name: 'Folder B',
    path: '/',
    children: [
      {
        id: 'sub_b1',
        type: TreeObjectType.FOLDER,
        name: 'Subfolder B1',
        path: '/Folder B',
        children: [],
      },
    ],
  },
  {
    id: 'root_c',
    type: TreeObjectType.FOLDER,
    name: 'Folder C',
    path: '/',
    children: [],
  },
];
