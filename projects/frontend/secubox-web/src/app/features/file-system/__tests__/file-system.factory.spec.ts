import { describe, expect, it } from 'vitest';
import { CreateFolder } from '../file-system.factory';
import { FileSystemObject } from '../file-system.model';

describe('CreateFolder', () => {
  it('should create a folder with a name and path', () => {
    const folderName = 'My Folder';
    const folderPath = '/Documents';

    const folderBuilder = new CreateFolder({ name: folderName, path: folderPath });
    const folder: FileSystemObject = folderBuilder.build();

    expect(folder).toBeDefined();
    expect(folder.id).toBeTypeOf('string');
    expect(folder.id.length).toBeGreaterThan(0);

    expect(folder.name).toBe(folderName);
    expect(folder.path).toBe(folderPath);
    expect(folder.childrens).toEqual([]);
  });

  it('should default path to root and name to empty string if not provided', () => {
    const folder = new CreateFolder({}).build();

    expect(folder.name).toBe('');
    expect(folder.path).toBe('/');
    expect(folder.childrens).toEqual([]);
  });

  it('should generate unique ids for multiple folders', () => {
    const f1 = new CreateFolder({ name: 'A', path: '/' }).build();
    const f2 = new CreateFolder({ name: 'B', path: '/' }).build();

    expect(f1.id).not.toBe(f2.id);
  });
});
