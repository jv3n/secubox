export interface TreeApiCommand {
  id: string;
  name: string;
  path: string;
  file?: File;
  childrens?: TreeApiCommand[];
}
