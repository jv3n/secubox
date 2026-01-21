import { FileSystemObject } from './file-system.model';

export class CreateFolder {
  id: string;
  name: string;
  path: string;
  childrens?: FileSystemObject[];

  constructor(obj: Partial<FileSystemObject>) {
    this.id = crypto.randomUUID();
    this.name = obj.name ?? '';
    this.path = obj.path ?? '/';
    this.childrens = [];
  }

  build() {
    return {
      id: this.id,
      name: this.name,
      path: this.path,
      childrens: this.childrens,
    } satisfies FileSystemObject;
  }
}

export class CreateFile {
  id: string;
  name: string;
  path: string;
  file: File;

  constructor(file: File, parent: FileSystemObject) {
    this.id = crypto.randomUUID();
    this.name = file.name ?? '';
    this.path = `${parent}/${parent.name}`;
    this.file = file;
  }

  build() {
    return {
      id: this.id,
      name: this.name,
      path: this.path,
      file: this.file,
    } satisfies FileSystemObject;
  }
}
