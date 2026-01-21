export interface FileSystemObject {
  id: string;
  name: string;
  path: string;
  file?: File;
  childrens?: FileSystemObject[];
}
