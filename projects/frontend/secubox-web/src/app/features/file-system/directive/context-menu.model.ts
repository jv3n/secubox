import { FileSystemObject } from '../file-system.model';

export interface ContextMenu {
  x: number;
  y: number;
  target: FileSystemObject | null;
}

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  target: FileSystemObject | null;
  parent: FileSystemObject | null;
}
