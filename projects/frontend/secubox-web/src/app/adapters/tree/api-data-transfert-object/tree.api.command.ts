import { TreeObjectType } from '../../../features/file-system/file-system.model';

export interface TreeApiCommand {
  id: string;
  tree: TreeFileApiCommand[];
}

export interface TreeFileApiCommand {
  id: string;
  type: TreeObjectType;
  name: string;
  path: string;
  file?: File;
  children?: TreeFileApiCommand[];
}
