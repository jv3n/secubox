export interface Tree {
  id: string;
  tree: TreeObject[];
}

export interface TreeObject {
  id: string;
  type: TreeObjectType;
  name: string;
  path: string;
  file?: File;
  children?: TreeObject[];
}

export enum TreeObjectType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
}
