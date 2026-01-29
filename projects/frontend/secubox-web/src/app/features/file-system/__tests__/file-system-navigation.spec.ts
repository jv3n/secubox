import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { ContextMenuDirective } from '../directive/context-menu.directive';
import { FileSystemComponent } from '../file-system.component';
import { FileSystemComponentStore } from '../file-system.component-store';
import { TreeObject, TreeObjectType } from '../file-system.model';
import { testFileSystemMock } from './test-data.mock';

describe('FileSystemComponent: Navigation', () => {
  let fixture: ComponentFixture<FileSystemComponent>;
  let component: FileSystemComponent;
  let mockStore: any;

  beforeEach(async () => {
    // Mock the store to avoid HTTP calls and provide test data
    mockStore = {
      tree: signal({ id: 'test-id', tree: testFileSystemMock }),
      load: vi.fn(),
      update: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FileSystemComponent, MatIconModule, ContextMenuDirective],
    })
      .overrideComponent(FileSystemComponent, {
        set: {
          providers: [
            {
              provide: FileSystemComponentStore,
              useValue: mockStore,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FileSystemComponent);
    component = fixture.componentInstance;

    // Manually set the tree data since the subscription might not trigger in tests
    component.tree.set(testFileSystemMock);
    component.treeId = 'test-id';

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should select a root folder', () => {
    const root = component.tree()[0];
    component.selectObj(root);
    expect(component.selectedObj).toBe(root);
  });

  it('should generate columns for root selection', () => {
    component.selectObj(component.tree()[0]);
    const cols = component.columns;
    expect(cols[0]).toEqual(component.tree());
    expect(cols.length).toBeGreaterThan(1);
  });

  it('should generate empty column for a folder with no children', () => {
    const emptyFolder = component
      .tree()
      .flatMap((f) => [f, ...(f.children ?? [])])
      .find((f) => !f.file && (f.children?.length ?? 0) === 0);

    expect(emptyFolder).toBeDefined();

    component.selectObj(emptyFolder!);
    const cols = component.columns;
    expect(cols[cols.length - 1]).toEqual([]);
  });

  it('should select a nested child folder and generate correct columns', () => {
    const rootFolder = component.tree()[0]; // Folder A
    const subFolder = rootFolder.children![0]; // Subfolder A1
    component.selectObj(subFolder);
    const cols = component.columns;

    expect(cols[0]).toEqual(component.tree());
    expect(cols[1]).toContain(subFolder);
    expect(cols[2]).toEqual(subFolder.children);
  });

  it('should stop generating columns when a file is selected', () => {
    // Create a file with file property to properly identify it as a file
    const parent = component.tree()[0]; // Folder A
    const file: TreeObject = {
      id: 'test_file',
      type: TreeObjectType.FILE,
      name: 'test.txt',
      path: '/Folder A',
      file: new File([], 'test.txt'),
    };
    parent.children!.push(file);

    component.selectObj(file);

    const cols = component.columns;
    // When selecting a file (with file property), columns should include parent's children
    expect(cols[cols.length - 1]).toContain(file);
  });

  it('should generate multiple levels correctly', () => {
    // Folder A -> Subfolder A1 -> Deep Folder A1
    const deepFolder = component.tree()[0].children![0].children![0];
    component.selectObj(deepFolder);
    const cols = component.columns;

    expect(cols.length).toBeGreaterThan(3);
    expect(cols[cols.length - 1]).toEqual(deepFolder.children);
  });

  it('should select a file inside nested folder', () => {
    // Use existing deep file: Folder A -> Subfolder A1 -> Deep Folder A1 -> deep-file.txt
    const deepFolder = component.tree()[0].children![0].children![0];
    const file = deepFolder.children![0];

    component.selectObj(file);
    const cols = component.columns;

    expect(component.selectedObj).toBe(file);
    expect(cols[cols.length - 1]).toContain(file);
  });

  // === New tests ===
  it('should update child column when selecting a different folder at same level', () => {
    const level1 = component.tree()[0].children!;
    const folderA1 = level1[0]; // Subfolder A1
    const folderA2 = level1[1]; // Subfolder A2

    component.selectObj(folderA1);
    let cols = component.columns;
    expect(cols[2]).toEqual(folderA1.children);

    component.selectObj(folderA2);
    cols = component.columns;
    expect(cols[2]).toEqual(folderA2.children);
  });

  it('should show empty column for a newly created folder', () => {
    const root = component.tree()[0]; // Folder A
    component.selectObj(root);

    const newFolder: TreeObject = {
      id: 'new_folder',
      type: TreeObjectType.FOLDER,
      name: 'New Folder',
      path: '/Folder A',
      children: [],
    };
    root.children!.push(newFolder);

    component.selectObj(newFolder);
    const cols = component.columns;

    expect(cols[cols.length - 1]).toEqual([]);
  });

  it('should keep selectedObj after creating a new file in selected folder', () => {
    const folder = component.tree()[0].children![0]; // Subfolder A1
    component.selectObj(folder);

    const newFile: TreeObject = {
      id: 'new_file',
      type: TreeObjectType.FILE,
      name: 'file.txt',
      path: '/Folder A/Subfolder A1',
      file: new File([], 'file.txt', { type: 'text/plain' }),
    };
    folder.children!.push(newFile);

    // Selected folder should stay the same
    expect(component.selectedObj).toBe(folder);

    component.selectObj(newFile);
    const cols = component.columns;
    expect(cols[cols.length - 1]).toContain(newFile);
  });
});
