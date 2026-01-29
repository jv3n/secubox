import { TreeObject } from '../file-system.model';

export interface ContextMenu {
  x: number;
  y: number;
  target: TreeObject | null;
}

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  target: TreeObject | null;
  parent: TreeObject | null;
}
