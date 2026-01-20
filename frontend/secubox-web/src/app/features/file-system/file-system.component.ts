import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { mockFileSystem } from '../../mocks/file-system-mock.service';
import { ContextMenuDirective } from './directive/context-menu.directive';
import { ContextMenuService } from './directive/context-menu.service';
import { FileSystemHelper } from './file-system.helper';
import { FileSystemObject } from './file-system.model';

@Component({
  selector: 'sb-file-system',
  templateUrl: `file-system.component.html`,
  styleUrl: `file-system.component.scss`,
  imports: [MatIcon, ContextMenuDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileSystemComponent {
  readonly contextMenu = inject(ContextMenuService);
  readonly fileSystemHelper = inject(FileSystemHelper);
  data = mockFileSystem;

  selectedObj: FileSystemObject | null = null;

  selectObj(obj: FileSystemObject) {
    this.selectedObj = obj;
  }

  get columns(): FileSystemObject[][] {
    const cols: FileSystemObject[][] = [];

    cols.push(this.data);

    if (!this.selectedObj) {
      return cols;
    }

    let currentChildren = this.data;
    let current: FileSystemObject | null = this.selectedObj;

    const pathStack: FileSystemObject[] = [];
    while (current) {
      pathStack.unshift(current);
      current = this.fileSystemHelper.findParent(current, this.data);
    }

    for (const folder of pathStack) {
      if (!folder.fileExtension) {
        const currentFolder = currentChildren.find((f) => f.id === folder.id);
        const children = currentFolder?.childrens ?? [];
        cols.push(children);
        currentChildren = children;
      } else {
        break;
      }
    }

    return cols;
  }
}
