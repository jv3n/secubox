import { FileSystemObject } from '../features/file-system/file-system.model';

export const mockFileSystem: FileSystemObject[] = [
  {
    id: 'root_docs',
    name: 'Documents',
    path: '/',
    childrens: [
      {
        id: 'doc_projects',
        name: 'Projets',
        path: '/Documents',
        childrens: [
          {
            id: 'proj_2026',
            name: 'Projet 2026',
            path: '/Documents/Projets',
            childrens: [
              {
                id: 'report',
                name: 'Rapport.pdf',
                path: '/Documents/Projets/Projet 2026',
                fileExtension: 'pdf',
              },
              {
                id: 'budget',
                name: 'Budget.xlsx',
                path: '/Documents/Projets/Projet 2026',
                fileExtension: 'xlsx',
              },
            ],
          },
          {
            id: 'proj_2025',
            name: 'Projet 2025',
            path: '/Documents/Projets',
            childrens: [
              {
                id: 'summary',
                name: 'Résumé.docx',
                path: '/Documents/Projets/Projet 2025',
                fileExtension: 'docx',
              },
            ],
          },
        ],
      },
      {
        id: 'doc_personal',
        name: 'Personnel',
        path: '/Documents',
        childrens: [
          {
            id: 'letters',
            name: 'Lettres',
            path: '/Documents/Personnel',
            childrens: [
              {
                id: 'letter_1',
                name: 'Lettre_Famille.pdf',
                path: '/Documents/Personnel/Lettres',
                fileExtension: 'pdf',
              },
            ],
          },
          {
            id: 'photos',
            name: 'Photos',
            path: '/Documents/Personnel',
            childrens: [
              {
                id: 'vacances_2025',
                name: 'Vacances_2025.jpeg',
                path: '/Documents/Personnel/Photos',
                fileExtension: 'jpeg',
              },
            ],
          },
        ],
      },
      {
        id: 'todo',
        name: 'Todo.txt',
        path: '/Documents',
        fileExtension: 'txt',
      },
    ],
  },
  {
    id: 'root_travail',
    name: 'Travail',
    path: '/',
    childrens: [
      {
        id: 'client_x',
        name: 'Client X',
        path: '/Travail',
        childrens: [
          {
            id: 'contrat',
            name: 'Contrat.docx',
            path: '/Travail/Client X',
            fileExtension: 'docx',
          },
          {
            id: 'invoice',
            name: 'Facture.pdf',
            path: '/Travail/Client X',
            fileExtension: 'pdf',
          },
        ],
      },
      {
        id: 'client_y',
        name: 'Client Y',
        path: '/Travail',
        childrens: [],
      },
    ],
  },
];
