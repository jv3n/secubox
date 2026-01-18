export interface FileItem {
  id: string;
  name: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  children?: Folder[];
  files?: FileItem[];
}
