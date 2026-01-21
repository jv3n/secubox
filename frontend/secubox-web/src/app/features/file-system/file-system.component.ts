import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { mockFileSystem } from '../../mocks/file-system-mock.service';
import FileDropComponent from './components/file-drop/file-drop.component';
import { ContextMenuDirective } from './directive/context-menu.directive';
import { ContextMenuService } from './directive/context-menu.service';
import { CreateFile } from './file-system.factory';
import { FileSystemHelper } from './file-system.helper';
import { FileSystemObject } from './file-system.model';

@Component({
  selector: 'sb-file-system',
  templateUrl: `file-system.component.html`,
  styleUrl: `file-system.component.scss`,
  imports: [MatIcon, ContextMenuDirective, FileDropComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileSystemComponent {
  readonly contextMenu = inject(ContextMenuService);
  readonly fileSystemHelper = inject(FileSystemHelper);
  data = mockFileSystem;

  selected = output<FileSystemObject>();

  selectedObj: FileSystemObject | null = null;

  selectObj(obj: FileSystemObject) {
    this.selectedObj = obj;
    this.selected.emit(obj);
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

    for (const obj of pathStack) {
      if (!obj.file) {
        const currentFolder = currentChildren.find((f) => f.id === obj.id);
        const children = currentFolder?.childrens ?? [];
        cols.push(children);
        currentChildren = children;
      } else {
        break;
      }
    }

    return cols;
  }

  onFilesDropped(files: File[]) {
    console.log('files: ', files);
    console.log('selected parent: ', this.selectedObj);

    if (!this.selectedObj) {
      return alert('Sélectionne un dossier !');
    }

    this.selectedObj.childrens = this.selectedObj.childrens ?? [];

    for (const f of this.toFileSystemObject(files, this.selectedObj)) {
      this.selectedObj.childrens.push(f);
    }
  }

  toFileSystemObject(files: File[], parent: FileSystemObject | null): FileSystemObject[] {
    if (!parent) {
      return [];
    }

    return files.map((f) => new CreateFile(f, parent));
  }
}
