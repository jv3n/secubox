import { FileSystemObject } from '../../../features/file-system/file-system.model';
import { TreeApiCommand } from '../api-data-transfert-object/tree.api.command';
import { TreeApiResponse } from '../api-data-transfert-object/tree.api.response';

export class TreeMapper {
  static readonly toCommand = (req: FileSystemObject): TreeApiCommand => ({
    ...req,
  });

  static readonly toTree = (res: TreeApiResponse): FileSystemObject => ({
    ...res,
  });
}
