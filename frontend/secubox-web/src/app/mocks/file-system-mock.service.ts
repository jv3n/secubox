import { FileSystemObject } from '../features/file-system/file-system.model';

// Helper pour créer un fichier mock
const createMockFile = (name: string, type: string): File => {
  return new File([], name, { type });
};

export const mockFileSystem: FileSystemObject[] = [
  {
    id: 'folder_rh',
    name: 'RH & Administration',
    path: '/',
    childrens: [
      {
        id: 'folder_paie',
        name: 'Bulletins de paie',
        path: '/RH & Administration',
        childrens: [
          {
            id: 'paie_2026_01',
            name: 'Bulletin_Janvier_2026.pdf',
            path: '/RH & Administration/Bulletins de paie',
            file: createMockFile('Bulletin_Janvier_2026.pdf', 'application/pdf'),
          },
          {
            id: 'paie_2025_12',
            name: 'Bulletin_Decembre_2025.pdf',
            path: '/RH & Administration/Bulletins de paie',
            file: createMockFile('Bulletin_Decembre_2025.pdf', 'application/pdf'),
          },
          {
            id: 'paie_2025_11',
            name: 'Bulletin_Novembre_2025.pdf',
            path: '/RH & Administration/Bulletins de paie',
            file: createMockFile('Bulletin_Novembre_2025.pdf', 'application/pdf'),
          },
        ],
      },
      {
        id: 'folder_contrats',
        name: 'Contrats de travail',
        path: '/RH & Administration',
        childrens: [
          {
            id: 'contrat_initial',
            name: 'Contrat_CDI_2023.pdf',
            path: '/RH & Administration/Contrats de travail',
            file: createMockFile('Contrat_CDI_2023.pdf', 'application/pdf'),
          },
          {
            id: 'avenant_1',
            name: 'Avenant_Augmentation_2025.pdf',
            path: '/RH & Administration/Contrats de travail',
            file: createMockFile('Avenant_Augmentation_2025.pdf', 'application/pdf'),
          },
        ],
      },
      {
        id: 'folder_conges',
        name: 'Congés et absences',
        path: '/RH & Administration',
        childrens: [
          {
            id: 'conges_2025',
            name: 'Demande_Conges_Ete_2025.pdf',
            path: '/RH & Administration/Congés et absences',
            file: createMockFile('Demande_Conges_Ete_2025.pdf', 'application/pdf'),
          },
        ],
      },
    ],
  },
  {
    id: 'folder_identite',
    name: 'Pièces d\'identité',
    path: '/',
    childrens: [
      {
        id: 'cni_recto',
        name: 'CNI_Recto.jpg',
        path: '/Pièces d\'identité',
        file: createMockFile('CNI_Recto.jpg', 'image/jpeg'),
      },
      {
        id: 'cni_verso',
        name: 'CNI_Verso.jpg',
        path: '/Pièces d\'identité',
        file: createMockFile('CNI_Verso.jpg', 'image/jpeg'),
      },
      {
        id: 'passeport',
        name: 'Passeport.pdf',
        path: '/Pièces d\'identité',
        file: createMockFile('Passeport.pdf', 'application/pdf'),
      },
      {
        id: 'permis_conduire',
        name: 'Permis_Conduire.jpg',
        path: '/Pièces d\'identité',
        file: createMockFile('Permis_Conduire.jpg', 'image/jpeg'),
      },
    ],
  },
  {
    id: 'folder_famille',
    name: 'Documents familiaux',
    path: '/',
    childrens: [
      {
        id: 'livret_famille',
        name: 'Livret_Famille.pdf',
        path: '/Documents familiaux',
        file: createMockFile('Livret_Famille.pdf', 'application/pdf'),
      },
      {
        id: 'acte_naissance',
        name: 'Acte_Naissance.pdf',
        path: '/Documents familiaux',
        file: createMockFile('Acte_Naissance.pdf', 'application/pdf'),
      },
    ],
  },
  {
    id: 'folder_fiscal',
    name: 'Fiscalité',
    path: '/',
    childrens: [
      {
        id: 'folder_impots',
        name: 'Déclarations d\'impôts',
        path: '/Fiscalité',
        childrens: [
          {
            id: 'impot_2025',
            name: 'Avis_Imposition_2025.pdf',
            path: '/Fiscalité/Déclarations d\'impôts',
            file: createMockFile('Avis_Imposition_2025.pdf', 'application/pdf'),
          },
          {
            id: 'impot_2024',
            name: 'Avis_Imposition_2024.pdf',
            path: '/Fiscalité/Déclarations d\'impôts',
            file: createMockFile('Avis_Imposition_2024.pdf', 'application/pdf'),
          },
        ],
      },
      {
        id: 'taxe_habitation',
        name: 'Taxe_Habitation_2025.pdf',
        path: '/Fiscalité',
        file: createMockFile('Taxe_Habitation_2025.pdf', 'application/pdf'),
      },
    ],
  },
  {
    id: 'folder_sante',
    name: 'Santé',
    path: '/',
    childrens: [
      {
        id: 'carte_vitale',
        name: 'Carte_Vitale.jpg',
        path: '/Santé',
        file: createMockFile('Carte_Vitale.jpg', 'image/jpeg'),
      },
      {
        id: 'mutuelle',
        name: 'Attestation_Mutuelle.pdf',
        path: '/Santé',
        file: createMockFile('Attestation_Mutuelle.pdf', 'application/pdf'),
      },
      {
        id: 'ordonnances',
        name: 'Ordonnances',
        path: '/Santé',
        childrens: [],
      },
    ],
  },
  {
    id: 'folder_divers',
    name: 'Divers',
    path: '/',
    childrens: [],
  },
];
