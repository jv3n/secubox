import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { FilePreviewComponent } from './components/preview/preview.component';
import { ContextMenuDirective } from './directive/context-menu.directive';
import { ContextMenuService } from './directive/context-menu.service';
import { FileSystemComponentStore, FileSystemComponentStoreProviders } from './file-system.component-store';
import { CreateFile } from './file-system.factory';
import { FileSystemHelper } from './file-system.helper';
import { Tree, TreeObject, TreeObjectType } from './file-system.model';

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

  treeId!: string;
  tree = signal<TreeObject[]>([]);

  constructor() {
    this.store.load('697aabb8e08e50243d9dfe9c'); // id premier utilisateur de test, plus tard gestion de token connexion et recup du tree du user

    toObservable(this.store.tree)
      .pipe(takeUntilDestroyed())
      .subscribe((tree: Tree) => {
        this.treeId = tree.id;
        this.tree.set(tree.tree);
      });
  }

  selected = output<TreeObject>();

  selectedObj: TreeObject | null = null;
  dragOverFolder: TreeObject | null = null;
  draggedItem: TreeObject | null = null;
  dragOverColumnIndex: number | null = null;
  selectedFile = signal<File | null>(null);
  previewWidth = signal<number>(600);
  isResizing = false;
  isPreviewCollapsed = signal<boolean>(true);

  selectObj(obj: TreeObject) {
    this.selectedObj = obj;
    this.selected.emit(obj);

    if (obj.file) {
      this.selectedFile.set(obj.file);
    } else {
      this.selectedFile.set(null);
    }
  }

  onDragStart(event: DragEvent, item: TreeObject) {
    this.draggedItem = item;
    event.dataTransfer!.effectAllowed = 'move';
  }

  onDragEnd() {
    this.draggedItem = null;
    this.dragOverFolder = null;
    this.dragOverColumnIndex = null;
  }

  onDragOver(event: DragEvent, folder: TreeObject) {
    event.preventDefault();
    event.stopPropagation();

    if (this.draggedItem && this.draggedItem.id === folder.id) {
      return;
    }

    this.dragOverFolder = folder;
    event.dataTransfer!.dropEffect = 'move';
  }

  onDragLeave() {
    this.dragOverFolder = null;
  }

  onDrop(event: DragEvent, targetFolder: TreeObject) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverFolder = null;

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

  moveItem(item: TreeObject, targetFolder: TreeObject) {
    if (item.id === targetFolder.id) {
      return;
    }

    const sourceParent = this.fileSystemHelper.findParent(item, this.tree());

    // Si pas de parent, l'élément est à la racine
    if (!sourceParent) {
      const index = this.tree().findIndex((child) => child.id === item.id);
      if (index !== -1) {
        this.tree().splice(index, 1);
      }
    } else {
      const index = sourceParent.children!.findIndex((child) => child.id === item.id);
      if (index !== -1) {
        sourceParent.children!.splice(index, 1);
      }
    }

    // Si le dossier cible est la racine virtuelle
    if (targetFolder.id === 'root') {
      this.tree().push(item);
    } else {
      targetFolder.children = targetFolder.children ?? [];
      targetFolder.children.push(item);
    }

    this.updateTree();
  }

  get columns(): TreeObject[][] {
    const cols: TreeObject[][] = [];

    cols.push(this.tree());

    if (!this.selectedObj) {
      return cols;
    }

    let currentChildren = this.tree();
    let current: TreeObject | null = this.selectedObj;

    const pathStack: TreeObject[] = [];
    while (current) {
      pathStack.unshift(current);
      current = this.fileSystemHelper.findParent(current, this.tree());
    }

    for (const obj of pathStack) {
      if (!obj.file) {
        const currentFolder = currentChildren.find((f) => f.id === obj.id);
        const children = currentFolder?.children ?? [];
        cols.push(children);
        currentChildren = children;
      } else {
        break;
      }
    }

    return cols;
  }

  onFilesDropped(files: File[], targetFolder: TreeObject) {
    targetFolder.children = targetFolder.children ?? [];
    const newFiles = files.map((f) => new CreateFile(f, targetFolder));
    targetFolder.children.push(...newFiles);

    this.updateTree();
  }

  private updateTree() {
    this.store.update({ id: this.treeId, tree: this.tree() });
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

  getColumnTargetFolder(columnIndex: number): TreeObject | null {
    if (columnIndex === 0) {
      return {
        id: 'root',
        type: TreeObjectType.FOLDER,
        name: 'Root',
        path: '/',
        children: this.tree(),
      };
    }

    if (!this.selectedObj) return null;

    let currentChildren = this.tree();
    let current: TreeObject | null = this.selectedObj;

    const pathStack: TreeObject[] = [];
    while (current) {
      pathStack.unshift(current);
      current = this.fileSystemHelper.findParent(current, this.tree());
    }

    let index = 0;
    for (const obj of pathStack) {
      if (!obj.file) {
        index++;
        if (index === columnIndex) return obj;
        const currentFolder = currentChildren.find((f) => f.id === obj.id);
        currentChildren = currentFolder?.children ?? [];
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

  togglePreview(): void {
    this.isPreviewCollapsed.set(!this.isPreviewCollapsed());
  }
}
