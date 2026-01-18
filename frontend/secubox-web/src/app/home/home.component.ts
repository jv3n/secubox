import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Folder } from '../model/folder';
import { ContextMenuDirective } from '../shared/directive/context-menu.directive';
import FileDropComponent from '../shared/file-drop/file-drop.component';

@Component({
  selector: 'sb-home',
  template: `
    <main class="home">
      <h1>Secubox</h1>

      <section class="columns">
        @for (column of columns; track column[0]?.id) {
          <div class="column" [contextMenu]="column" (menuRequested)="openContextMenu($event)">
            <ul class="list">
              @for (folder of column; track folder.id) {
                <li
                  class="entry entry--folder"
                  [class.selected]="selectedFolder === folder"
                  (click)="selectFolder(folder, column)"
                  [contextMenu]="folder"
                  (menuRequested)="openContextMenu($event)"
                >
                  <mat-icon>folder</mat-icon>
                  <span>{{ folder.name }}</span>
                </li>
              }
            </ul>
          </div>
        }

        @if (selectedFolder?.files; as files) {
          <div class="column" [contextMenu]="selectedFolder" (menuRequested)="openContextMenu($event)">
            <ul class="list">
              @for (file of files; track file.id) {
                <li class="entry entry--file" [class.selected]="selectedFile === file" (click)="selectFile(file)">
                  <mat-icon>insert_drive_file</mat-icon>
                  <span>{{ file.name }}</span>
                </li>
              }
            </ul>
          </div>
        }
      </section>

      @if (contextMenuVisible) {
        <div class="context-menu" [style.top.px]="contextMenuY" [style.left.px]="contextMenuX">
          <button (click)="createFolder()">Nouveau dossier</button>

          @if (contextMenuFolder) {
            <button (click)="renameFolder()">Renommer</button>
            <button (click)="deleteFolder()">Supprimer</button>
          }
        </div>
      }

      <sb-file-drop class="drop-zone" (filesDropped)="onFilesDropped($event)" />
    </main>
  `,
  styleUrls: ['./home.component.scss'],
  imports: [FileDropComponent, MatIcon, ContextMenuDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  folders: Folder[] = [
    { id: 'root1', name: 'Documents', children: [], files: [] },
    { id: 'root2', name: 'Travail', children: [], files: [] },
  ];
  path: Folder[] = [];
  selectedFolder: Folder | null = null;

  get columns(): Folder[][] {
    const cols: Folder[][] = [];
    cols.push(this.folders);

    for (const folder of this.path) {
      if (folder.children?.length) cols.push(folder.children);
    }
    return cols;
  }

  selectedFile: { id: string; name: string } | null = null;
  selectFile(file: { id: string; name: string }) {
    this.selectedFile = file;
  }
  selectFolder(folder: Folder, column: Folder[]) {
    this.selectedFolder = folder;
    this.selectedFile = null;
    const index = this.columns.indexOf(column);
    this.path = this.path.slice(0, index);
    this.path.push(folder);
  }
  columnFiles(column: Folder[]): { id: string; name: string }[] {
    const folder = column.find((f) => f === this.selectedFolder);
    return folder?.files ?? [];
  }
  onFilesDropped(files: File[]) {
    if (!this.selectedFolder) return alert('Sélectionne un dossier !');
    this.selectedFolder.files = this.selectedFolder.files ?? [];
    for (const file of files) {
      this.selectedFolder.files.push({ id: crypto.randomUUID(), name: file.name });
    }
  }

  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuColumn: Folder[] | null = null;
  contextMenuFolder: Folder | null = null;

  openContextMenu(event: { x: number; y: number; data: any }) {
    this.contextMenuX = event.x;
    this.contextMenuY = event.y;

    if ('files' in event.data) {
      this.contextMenuFolder = event.data;
      this.contextMenuColumn = null;
    } else {
      this.contextMenuColumn = event.data;
      this.contextMenuFolder = null;
    }

    this.contextMenuVisible = true;
  }

  closeContextMenu() {
    this.contextMenuVisible = false;
  }

  createFolder() {
    if (!this.contextMenuColumn && !this.contextMenuFolder) return;

    const name = prompt('Nom du nouveau dossier ?');

    if (!name) return;

    const newFolder: Folder = { id: crypto.randomUUID(), name, children: [], files: [] };

    if (this.contextMenuFolder) {
      this.contextMenuFolder.children = this.contextMenuFolder.children ?? [];
      this.contextMenuFolder.children.push(newFolder);
    } else if (this.contextMenuColumn) {
      const parent = this.path[this.columns.indexOf(this.contextMenuColumn) - 1];

      if (parent) {
        parent.children = parent.children ?? [];
        parent.children.push(newFolder);
      } else {
        this.folders.push(newFolder);
      }
    }

    this.closeContextMenu();
  }
  renameFolder() {
    if (!this.contextMenuFolder) return;

    const newName = prompt('Nouveau nom du dossier ?', this.contextMenuFolder.name);
    if (!newName) return;
    this.contextMenuFolder.name = newName;
    this.closeContextMenu();
  }
  deleteFolder() {
    if (!this.contextMenuFolder) return;
    const folder = this.contextMenuFolder;
    if (!confirm(`Supprimer le dossier "${folder.name}" ?`)) return;
    const parentIndex = this.path.indexOf(folder) - 1;
    const parent = parentIndex >= 0 ? this.path[parentIndex] : null;

    if (parent?.children) {
      parent.children = parent.children.filter((f) => f.id !== folder.id);
    } else {
      this.folders = this.folders.filter((f) => f.id !== folder.id);
    }

    if (this.selectedFolder === folder) {
      this.selectedFolder = null;
      this.path = [];
    }

    this.closeContextMenu();
  }
}
