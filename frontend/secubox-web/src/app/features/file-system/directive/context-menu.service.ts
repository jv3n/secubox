import { Injectable, signal } from '@angular/core';
import { CreateFolder } from '../file-system.factory';
import { FileSystemObject } from '../file-system.model';
import { ContextMenu, ContextMenuState } from './context-menu.model';

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  private readonly _state = signal<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    target: null,
    parent: null,
  });

  readonly state = this._state.asReadonly();

  open(evt: ContextMenu, parent: FileSystemObject | null = null) {
    this._state.set({
      visible: true,
      x: evt.x,
      y: evt.y,
      target: evt.target ?? null,
      parent: parent,
    });
  }

  close() {
    this._state.update((s) => ({
      ...s,
      visible: false,
      target: null,
      parent: null,
    }));
  }

  get target(): FileSystemObject | null {
    return this._state().target;
  }

  get parent(): FileSystemObject | null {
    return this._state().parent;
  }

  get isOpen(): boolean {
    return this._state().visible;
  }

  createFolder(rootData: FileSystemObject[]) {
    const parent = this.parent;

    const name = prompt('Nom du nouveau dossier ?');
    if (!name) return;

    const newFolder: FileSystemObject = new CreateFolder({
      name,
      path: parent ? (parent.path === '/' ? `/${parent.name}` : `${parent.path}/${parent.name}`) : '/',
    }).build();

    if (parent) {
      parent.childrens = parent.childrens ?? [];
      parent.childrens.push(newFolder);
    } else {
      rootData.push(newFolder);
    }
  }

  rename() {
    const target = this.target;
    if (!target) return;

    const name = prompt('Nouveau nom ?', target.name);
    if (name) target.name = name;
  }

  delete(rootData: FileSystemObject[]) {
    if (!this.target) return;

    const parent = this.parent;

    if (parent) {
      parent.childrens = parent.childrens?.filter((f) => f.id !== this.target?.id) ?? [];
    } else {
      // deleting at root level
      const index = rootData.findIndex((f) => f.id === this.target?.id);
      if (index !== -1) {
        rootData.splice(index, 1);
      }
    }

    this.close();
  }
}
