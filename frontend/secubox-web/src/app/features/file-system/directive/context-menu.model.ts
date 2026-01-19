import { FileSystemObject } from '../file-system.model';

export interface FileSystemMouseContext {
  x: number;
  y: number;
  data: FileSystemObject | null;
}
