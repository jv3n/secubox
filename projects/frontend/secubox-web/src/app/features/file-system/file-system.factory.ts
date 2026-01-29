import { TreeObject, TreeObjectType } from './file-system.model';

export class CreateFolder {
  id: string;
  type: TreeObjectType;
  name: string;
  path: string;
  children?: TreeObject[];

  constructor(obj: Partial<TreeObject>) {
    this.id = crypto.randomUUID();
    this.type = TreeObjectType.FOLDER;
    this.name = obj.name ?? '';
    this.path = obj.path ?? '/';
    this.children = [];
  }

  build() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      path: this.path,
      children: this.children,
    } satisfies TreeObject;
  }
}

export class CreateFile {
  id: string;
  type: TreeObjectType;
  name: string;
  path: string;
  file: File;

  constructor(file: File, parent: TreeObject) {
    this.id = crypto.randomUUID();
    this.type = TreeObjectType.FILE;
    this.name = file.name ?? '';
    this.path = `${parent}/${parent.name}`;
    this.file = file;
  }

  build() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      path: this.path,
      file: this.file,
    } satisfies TreeObject;
  }
}
