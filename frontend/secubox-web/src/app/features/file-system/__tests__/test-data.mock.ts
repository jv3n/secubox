import { FileSystemObject } from '../file-system.model';

/**
 * Mock data dédié aux tests - Simple et stable
 * Ne pas modifier sans mettre à jour les tests correspondants
 */
export const testFileSystemMock: FileSystemObject[] = [
  {
    id: 'root_a',
    name: 'Folder A',
    path: '/',
    childrens: [
      {
        id: 'sub_a1',
        name: 'Subfolder A1',
        path: '/Folder A',
        childrens: [
          {
            id: 'deep_a1',
            name: 'Deep Folder A1',
            path: '/Folder A/Subfolder A1',
            childrens: [
              {
                id: 'file_deep',
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
        name: 'Subfolder A2',
        path: '/Folder A',
        childrens: [],
      },
    ],
  },
  {
    id: 'root_b',
    name: 'Folder B',
    path: '/',
    childrens: [
      {
        id: 'sub_b1',
        name: 'Subfolder B1',
        path: '/Folder B',
        childrens: [],
      },
    ],
  },
  {
    id: 'root_c',
    name: 'Folder C',
    path: '/',
    childrens: [],
  },
];
