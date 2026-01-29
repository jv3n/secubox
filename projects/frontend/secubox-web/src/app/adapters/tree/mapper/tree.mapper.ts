import { Tree } from '../../../features/file-system/file-system.model';
import { TreeApiCommand } from '../api-data-transfert-object/tree.api.command';
import { TreeApiResponse } from '../api-data-transfert-object/tree.api.response';

export class TreeMapper {
  static readonly toCommand = (req: Tree): TreeApiCommand => ({
    ...req,
  });

  static readonly toTree = (res: TreeApiResponse): Tree => ({
    ...res,
  });
}
