import { TestBed } from '@angular/core/testing';
import { ContextMenu } from '../directive/context-menu.model';
import { ContextMenuService } from '../directive/context-menu.service';
import { FileSystemObject } from '../file-system.model';

describe('ContextMenuService', () => {
  let service: ContextMenuService;

  let rootData: FileSystemObject[];
  let rootFolder: FileSystemObject;
  let childFolder: FileSystemObject;

  beforeEach(() => {
    service = TestBed.inject(ContextMenuService);

    childFolder = {
      id: 'child_1',
      name: 'Projects',
      path: '/Documents',
      childrens: [],
    };

    rootFolder = {
      id: 'root_docs',
      name: 'Documents',
      path: '/',
      childrens: [childFolder],
    };

    rootData = [rootFolder];
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('state handling', () => {
    it('should open context menu with target and parent', () => {
      const evt = { x: 100, y: 200, target: childFolder } satisfies ContextMenu;
      service.open(evt, rootFolder);

      const state = service.state();
      expect(state.visible).toBe(true);
      expect(state.x).toBe(100);
      expect(state.y).toBe(200);
      expect(state.target).toBe(childFolder);
      expect(state.parent).toBe(rootFolder);
    });

    it('should close context menu and reset target and parent', () => {
      const evt = { x: 10, y: 10, target: childFolder } satisfies ContextMenu;
      service.open(evt, rootFolder);
      service.close();

      const state = service.state();
      expect(state.visible).toBe(false);
      expect(state.target).toBeNull();
      expect(state.parent).toBeNull();
    });

    it('should expose getters correctly', () => {
      const evt = { x: 0, y: 0, target: childFolder } satisfies ContextMenu;
      service.open(evt, rootFolder);

      expect(service.isOpen).toBe(true);
      expect(service.target).toBe(childFolder);
      expect(service.parent).toBe(rootFolder);
    });
  });

  describe('createFolder', () => {
    it('should create a folder at root level when parent is null', () => {
      vi.spyOn(window, 'prompt').mockReturnValue('New Root Folder');

      const evt = { x: 0, y: 0, target: null } satisfies ContextMenu;
      service.open(evt, null);
      service.createFolder(rootData);

      expect(rootData.length).toBe(2);
      expect(rootData[1].name).toBe('New Root Folder');
      expect(rootData[1].path).toBe('/');
      expect(rootData[1].childrens).toEqual([]);
    });

    it('should create a folder inside a parent folder', () => {
      vi.spyOn(window, 'prompt').mockReturnValue('Child Folder');

      const evt = { x: 0, y: 0, target: null } satisfies ContextMenu;
      service.open(evt, rootFolder);
      service.createFolder(rootData);

      expect(rootFolder.childrens!.length).toBe(2);
      const created = rootFolder.childrens![1];
      expect(created.name).toBe('Child Folder');
      expect(created.path).toBe('/Documents');
      expect(created.childrens).toEqual([]);
    });

    it('should not create folder if prompt is cancelled', () => {
      const evt = { x: 0, y: 0, target: null } satisfies ContextMenu;
      vi.spyOn(window, 'prompt').mockReturnValue(null);

      service.open(evt, rootFolder);
      service.createFolder(rootData);

      expect(rootFolder.childrens!.length).toBe(1);
    });
  });

  describe('rename', () => {
    it('should rename target object', () => {
      const evt = { x: 0, y: 0, target: childFolder } satisfies ContextMenu;
      vi.spyOn(window, 'prompt').mockReturnValue('Renamed');

      service.open(evt, rootFolder);
      service.rename();

      expect(childFolder.name).toBe('Renamed');
    });

    it('should not rename if no target', () => {
      vi.spyOn(window, 'prompt').mockReturnValue('X');

      const evt = { x: 0, y: 0, target: null } satisfies ContextMenu;
      service.open(evt, null);
      service.rename();

      expect(childFolder.name).toBe('Projects');
    });

    it('should not rename if prompt is cancelled', () => {
      vi.spyOn(window, 'prompt').mockReturnValue(null);

      const evt = { x: 0, y: 0, target: childFolder } satisfies ContextMenu;
      service.open(evt, rootFolder);
      service.rename();

      expect(childFolder.name).toBe('Projects');
    });
  });

  describe('delete', () => {
    it('should delete target from parent childrens', () => {
      const evt = { x: 0, y: 0, target: childFolder } satisfies ContextMenu;
      service.open(evt, rootFolder);
      service.delete(rootData);

      expect(rootFolder.childrens!.length).toBe(0);
      expect(service.isOpen).toBe(false);
    });

    it('should delete target at root level', () => {
      const evt = { x: 0, y: 0, target: rootFolder } satisfies ContextMenu;
      service.open(evt, null);
      service.delete(rootData);

      expect(rootData.length).toBe(0);
      expect(service.isOpen).toBe(false);
    });

    it('should do nothing if no target', () => {
      const evt = { x: 0, y: 0, target: null } satisfies ContextMenu;
      service.open(evt, null);
      service.delete(rootData);

      expect(rootData.length).toBe(1);
      expect(rootFolder.childrens!.length).toBe(1);
    });
  });

  it('should create a folder inside an empty folder instead of root', () => {
    const emptyFolder = {
      id: 'empty_1',
      name: 'Empty Folder',
      path: '/Documents',
      childrens: [],
    } satisfies FileSystemObject;
    rootFolder.childrens!.push(emptyFolder);

    vi.spyOn(window, 'prompt').mockReturnValue('Nested Folder');

    // simulate right click + open context menu on empty folder
    const evt = { x: 0, y: 0, target: null } satisfies ContextMenu;
    service.open(evt, emptyFolder);
    service.createFolder(rootData);

    expect(emptyFolder.childrens!.length).toBe(1);
    const created = emptyFolder.childrens![0] as FileSystemObject;
    expect(created.name).toBe('Nested Folder');
    expect(created.path).toBe('/Documents/Empty Folder');
    expect(created.childrens).toEqual([]);

    // rootData should stay unchanged (except for emptyFolder already there)
    expect(rootData.length).toBe(1);
  });
});
