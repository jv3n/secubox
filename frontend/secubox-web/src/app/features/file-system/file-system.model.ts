export interface FileSystemObject {
  id: string;
  name: string;
  path: string;
  fileExtension?: string;
  folderChildren?: FileSystemObject[];
}

export class CreateFolder {
  id: string;
  name: string;
  path: string;
  folderChildren?: FileSystemObject[];

  constructor(obj: Partial<FileSystemObject>) {
    this.id = crypto.randomUUID();
    this.name = obj.name ?? '';
    this.path = obj.path ?? '/';
    this.folderChildren = [];
  }

  build() {
    return {
      id: this.id,
      name: this.name,
      path: this.path,
      folderChildren: this.folderChildren,
    } satisfies FileSystemObject;
  }
}
