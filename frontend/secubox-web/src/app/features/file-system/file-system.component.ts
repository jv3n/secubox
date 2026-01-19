import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { mockFileSystem } from '../../utils/file-system-mock.service';
import { ContextMenuDirective } from './directive/context-menu.directive';
import { FileSystemObject } from './file-system.model';

@Component({
  selector: 'sb-file-system',
  templateUrl: `file-system.component.html`,
  styleUrl: `file-system.component.scss`,
  imports: [MatIcon, ContextMenuDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileSystemComponent {
  data = mockFileSystem;

  selectedObj: FileSystemObject | null = null;

  selectObj(obj: FileSystemObject) {
    this.selectedObj = obj;
  }

  get columns(): FileSystemObject[][] {
    const cols: FileSystemObject[][] = [];

    cols.push(this.data);

    if (!this.selectedObj) return cols;

    let currentChildren = this.data;
    let current: FileSystemObject | null = this.selectedObj;

    const pathStack: FileSystemObject[] = [];
    while (current) {
      pathStack.unshift(current);
      current = this.findParent(current, this.data);
    }

    for (const folder of pathStack) {
      if (!folder.fileExtension) {
        const currentFolder = currentChildren.find((f) => f.id === folder.id);
        const children = currentFolder?.folderChildren ?? [];
        cols.push(children);
        currentChildren = children;
      } else {
        break;
      }
    }

    return cols;
  }

  private findParent(obj: FileSystemObject, tree: FileSystemObject[]): FileSystemObject | null {
    for (const node of tree) {
      if (node.folderChildren?.some((child) => child.id === obj.id)) {
        return node;
      }
      if (node.folderChildren?.length) {
        const parent = this.findParent(obj, node.folderChildren);
        if (parent) return parent;
      }
    }
    return null;
  }
}
