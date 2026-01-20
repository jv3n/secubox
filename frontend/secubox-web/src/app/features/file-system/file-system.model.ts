export interface FileSystemObject {
  id: string;
  name: string;
  path: string;
  fileExtension?: string;
  childrens?: FileSystemObject[];
}
