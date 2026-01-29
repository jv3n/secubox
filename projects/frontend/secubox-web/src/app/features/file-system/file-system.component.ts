import { ChangeDetectionStrategy, Component, computed, effect, inject, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FilePreviewComponent } from './components/preview/preview.component';
import { ContextMenuDirective } from './directive/context-menu.directive';
import { ContextMenuService } from './directive/context-menu.service';
import { CreateFile } from './file-system.factory';
import { FileSystemHelper } from './file-system.helper';
import { FileSystemObject } from './file-system.model';
import { mockFileSystem } from '../../core/mocks/file-system-mock.service';
import { FileSystemComponentStore, FileSystemComponentStoreProviders } from './file-system.component-store';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'sb-file-system',
  templateUrl: `file-system.component.html`,
  styleUrl: `file-system.component.scss`,
  imports: [MatIcon, ContextMenuDirective, FilePreviewComponent],
  providers: [...FileSystemComponentStoreProviders],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileSystemComponent {
  readonly contextMenu = inject(ContextMenuService);
  readonly store = inject(FileSystemComponentStore);
  readonly fileSystemHelper = inject(FileSystemHelper);

  data: FileSystemObject[] = mockFileSystem;

  constructor() {
    this.store.loadRootTree();

    toObservable(this.store.tree)
      .pipe(takeUntilDestroyed())
      .subscribe((tree) => {
        if (tree?.childrens) {
          this.data = tree.childrens;
        }
      });
  }

  selected = output<FileSystemObject>();

  selectedObj: FileSystemObject | null = null;
  dragOverFolder: FileSystemObject | null = null;
  draggedItem: FileSystemObject | null = null;
  dragOverColumnIndex: number | null = null;
  selectedFile = signal<File | null>(null);
  previewWidth = signal<number>(600);
  isResizing = false;

  selectObj(obj: FileSystemObject) {
    this.selectedObj = obj;
    this.selected.emit(obj);

    if (obj.file) {
      this.selectedFile.set(obj.file);
    } else {
      this.selectedFile.set(null);
    }
  }

  onDragStart(event: DragEvent, item: FileSystemObject) {
    this.draggedItem = item;
    event.dataTransfer!.effectAllowed = 'move';
  }

  onDragEnd() {
    this.draggedItem = null;
    this.dragOverFolder = null;
    this.dragOverColumnIndex = null;
  }

  onDragOver(event: DragEvent, folder: FileSystemObject) {
    event.preventDefault();
    event.stopPropagation();

    // Empêcher de déposer un dossier dans lui-même
    if (this.draggedItem && this.draggedItem.id === folder.id) {
      return;
    }

    this.dragOverFolder = folder;
    event.dataTransfer!.dropEffect = 'move';
  }

  onDragLeave() {
    this.dragOverFolder = null;
  }

  onDrop(event: DragEvent, targetFolder: FileSystemObject) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverFolder = null;

    // Cas 1: Déplacement d'un élément interne
    if (this.draggedItem) {
      this.moveItem(this.draggedItem, targetFolder);
      this.draggedItem = null;
      return;
    }

    // Cas 2: Drop de fichiers depuis l'extérieur
    const files = Array.from(event.dataTransfer?.files ?? []);
    if (files.length) {
      this.onFilesDropped(files, targetFolder);
    }
  }

  moveItem(item: FileSystemObject, targetFolder: FileSystemObject) {
    if (item.id === targetFolder.id) {
      return;
    }

    const sourceParent = this.fileSystemHelper.findParent(item, this.data);

    // Si pas de parent, l'élément est à la racine
    if (!sourceParent) {
      const index = this.data.findIndex((child) => child.id === item.id);
      if (index !== -1) {
        this.data.splice(index, 1);
      }
    } else {
      const index = sourceParent.childrens!.findIndex((child) => child.id === item.id);
      if (index !== -1) {
        sourceParent.childrens!.splice(index, 1);
      }
    }

    // Si le dossier cible est la racine virtuelle
    if (targetFolder.id === 'root') {
      this.data.push(item);
    } else {
      targetFolder.childrens = targetFolder.childrens ?? [];
      targetFolder.childrens.push(item);
    }

    // Appel API pour mise à jour du tree
    this.store.update({ id: 'root', name: 'Root', path: '/', childrens: this.data });
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

  onFilesDropped(files: File[], targetFolder: FileSystemObject) {
    targetFolder.childrens = targetFolder.childrens ?? [];
    const newFiles = files.map((f) => new CreateFile(f, targetFolder));
    targetFolder.childrens.push(...newFiles);

    // Appel API pour mise à jour du tree
    this.store.update({ id: 'root', name: 'Root', path: '/', childrens: this.data });
  }

  onColumnDragOver(event: DragEvent, columnIndex: number) {
    event.preventDefault();
    event.stopPropagation();

    this.dragOverColumnIndex = columnIndex;
    event.dataTransfer!.dropEffect = 'move';
  }

  onColumnDragLeave() {
    this.dragOverColumnIndex = null;
  }

  onColumnDrop(event: DragEvent, columnIndex: number) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverColumnIndex = null;

    const targetFolder = this.getColumnTargetFolder(columnIndex);
    if (!targetFolder) return;

    if (this.draggedItem) {
      this.moveItem(this.draggedItem, targetFolder);
      this.draggedItem = null;
      return;
    }

    const files = Array.from(event.dataTransfer?.files ?? []);
    if (files.length) {
      this.onFilesDropped(files, targetFolder);
    }
  }

  getColumnTargetFolder(columnIndex: number): FileSystemObject | null {
    if (columnIndex === 0) {
      return {
        id: 'root',
        name: 'Root',
        path: '/',
        childrens: this.data,
      };
    }

    if (!this.selectedObj) return null;

    let currentChildren = this.data;
    let current: FileSystemObject | null = this.selectedObj;

    const pathStack: FileSystemObject[] = [];
    while (current) {
      pathStack.unshift(current);
      current = this.fileSystemHelper.findParent(current, this.data);
    }

    let index = 0;
    for (const obj of pathStack) {
      if (!obj.file) {
        index++;
        if (index === columnIndex) return obj;
        const currentFolder = currentChildren.find((f) => f.id === obj.id);
        currentChildren = currentFolder?.childrens ?? [];
      } else {
        break;
      }
    }

    return null;
  }

  onResizeStart(event: MouseEvent): void {
    event.preventDefault();
    this.isResizing = true;

    const onMouseMove = (e: MouseEvent) => {
      if (this.isResizing) {
        const containerWidth = (e.target as HTMLElement).closest('.file-system-container')?.clientWidth || 0;
        const newWidth = containerWidth - e.clientX;

        // Limites min/max
        if (newWidth >= 300 && newWidth <= containerWidth - 400) {
          this.previewWidth.set(newWidth);
        }
      }
    };

    const onMouseUp = () => {
      this.isResizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }
}
