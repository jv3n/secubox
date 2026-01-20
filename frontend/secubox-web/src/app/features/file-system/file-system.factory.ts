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
