export interface TreeApiResponse {
  id: string;
  name: string;
  path: string;
  file?: File;
  childrens?: TreeApiResponse[];
}
