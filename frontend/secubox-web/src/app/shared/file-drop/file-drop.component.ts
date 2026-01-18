import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'sb-file-drop',
  styleUrls: ['./file-drop.component.scss'],
  template: `
    <div
      class="dropzone"
      [class.dragging]="isDragging"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
    >
      <p>Dépose tes fichiers ici</p>
      <span>ou clique pour sélectionner</span>

      <input #fileInput type="file" hidden multiple (change)="onFileSelected($event)" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FileDropComponent {
  filesDropped = output<File[]>();

  isDragging = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    const files = Array.from(event.dataTransfer?.files ?? []);
    if (files.length) {
      this.filesDropped.emit(files);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length) {
      this.filesDropped.emit(files);
    }
    input.value = '';
  }
}
