import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { ContextMenuDirective } from '../directive/context-menu.directive';
import { FileSystemComponent } from '../file-system.component';
import { FileSystemObject } from '../file-system.model';

describe('FileSystemComponent: Navigation', () => {
  let fixture: ComponentFixture<FileSystemComponent>;
  let component: FileSystemComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileSystemComponent, MatIconModule, ContextMenuDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(FileSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should select a root folder', () => {
    const root = component.data[0];
    component.selectObj(root);
    expect(component.selectedObj).toBe(root);
  });

  it('should generate columns for root selection', () => {
    component.selectObj(component.data[0]);
    const cols = component.columns;
    expect(cols[0]).toEqual(component.data);
    expect(cols.length).toBeGreaterThan(1);
  });

  it('should generate empty column for a folder with no children', () => {
    const emptyFolder = component.data
      .flatMap((f) => [f, ...(f.childrens ?? [])])
      .find((f) => !f.fileExtension && (f.childrens?.length ?? 0) === 0);

    expect(emptyFolder).toBeDefined();

    component.selectObj(emptyFolder!);
    const cols = component.columns;
    expect(cols[cols.length - 1]).toEqual([]);
  });

  it('should select a nested child folder and generate correct columns', () => {
    const doc1 = component.data[0].childrens![0];
    component.selectObj(doc1);
    const cols = component.columns;

    expect(cols[0]).toEqual(component.data);
    expect(cols[1]).toContain(doc1);
    expect(cols[2]).toEqual(doc1.childrens);
  });

  it('should stop generating columns when a file is selected', () => {
    const file = component.data.flatMap((f) => [f, ...(f.childrens ?? [])]).find((f) => !!f.fileExtension);

    expect(file).toBeDefined();
    component.selectObj(file!);

    const cols = component.columns;
    expect(cols[cols.length - 1]).toContain(file);
    // No column after file
    if (cols.length > 1) {
      expect(cols.slice(cols.length)).toEqual([]);
    }
  });

  it('should generate multiple levels correctly', () => {
    const dossier4 = component.data[0].childrens![0].childrens![0];
    component.selectObj(dossier4);
    const cols = component.columns;

    expect(cols.length).toBeGreaterThan(3);
    expect(cols[cols.length - 1]).toEqual(dossier4.childrens);
  });

  it('should select a file inside nested folder', () => {
    const file = component.data[0].childrens![0].childrens![0].childrens![0];
    component.selectObj(file);
    const cols = component.columns;

    expect(component.selectedObj).toBe(file);
    expect(cols[cols.length - 1]).toContain(file);
  });

  // === New tests ===
  it('should update child column when selecting a different folder at same level', () => {
    const level1 = component.data[0].childrens!;
    const folderA = level1[0];
    const folderB = level1[1];

    component.selectObj(folderA);
    let cols = component.columns;
    expect(cols[2]).toEqual(folderA.childrens);

    component.selectObj(folderB);
    cols = component.columns;
    expect(cols[2]).toEqual(folderB.childrens);
  });

  it('should show empty column for a newly created folder', () => {
    const root = component.data[0];
    component.selectObj(root);

    const newFolder: FileSystemObject = {
      id: 'new_folder',
      name: 'New Folder',
      path: '/Documents',
      childrens: [],
    };
    root.childrens!.push(newFolder);

    component.selectObj(newFolder);
    const cols = component.columns;

    expect(cols[cols.length - 1]).toEqual([]);
  });

  it('should keep selectedObj after creating a new file in selected folder', () => {
    const folder = component.data[0].childrens![0];
    component.selectObj(folder);

    const newFile: FileSystemObject = {
      id: 'new_file',
      name: 'file.txt',
      path: '/Documents/Projet A',
      fileExtension: 'txt',
    };
    folder.childrens!.push(newFile);

    // Selected folder should stay the same
    expect(component.selectedObj).toBe(folder);

    component.selectObj(newFile);
    const cols = component.columns;
    expect(cols[cols.length - 1]).toContain(newFile);
  });
});
