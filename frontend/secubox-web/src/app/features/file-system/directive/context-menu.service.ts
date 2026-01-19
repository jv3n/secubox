import { Injectable, signal } from '@angular/core';
import { CreateFolder, FileSystemObject } from '../file-system.model';

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  path: FileSystemObject | null;
}

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  private readonly _state = signal<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    path: null,
  });

  readonly state = this._state.asReadonly();

  /* === Ouverture === */
  open(x: number, y: number, folder: FileSystemObject | null) {
    this._state.set({
      visible: true,
      x,
      y,
      path: folder,
    });
  }

  /* === Fermeture === */
  close() {
    this._state.update((s) => ({
      ...s,
      visible: false,
      path: null,
    }));
  }

  /* === Helpers === */
  get path(): FileSystemObject | null {
    return this._state().path;
  }

  get isOpen(): boolean {
    return this._state().visible;
  }

  // ###### ACTIONS ###### //
  createFolder(parent: FileSystemObject | null) {
    const name = prompt('Nom du nouveau dossier ?');
    if (!name) {
      return;
    }

    const newFolder: FileSystemObject = new CreateFolder({
      name: name,
      path: `${parent?.path}/${parent?.name}`,
    }).build();
  }

  rename(obj: FileSystemObject) {
    const name = prompt('Nouveau nom ?', obj.name);
    if (name) {
      obj.name = name;
    }
  }

  // delete(obj: FileSystemObject) {
  //   const parentIndex = obj.path.indexOf(folder) - 1;
  //   const parent = parentIndex >= 0 ? path[parentIndex] : null;
  //
  //   if (parent?.children) {
  //     parent.children = parent.children.filter((f) => f.id !== folder.id);
  //   } else {
  //     const idx = rootFolders.findIndex((f) => f.id === folder.id);
  //     if (idx !== -1) rootFolders.splice(idx, 1);
  //   }
  // }
}
