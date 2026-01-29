import { TreeObjectType } from '../../../features/file-system/file-system.model';

export interface TreeApiResponse {
  id: string;
  tree: TreeFileApiResponse[];
}

export interface TreeFileApiResponse {
  id: string;
  type: TreeObjectType;
  name: string;
  path: string;
  file?: File;
  children?: TreeFileApiResponse[];
}
