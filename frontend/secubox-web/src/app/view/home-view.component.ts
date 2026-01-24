import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilePreviewComponent } from '../features/file-system/components/preview/preview.component';
import { FileSystemComponent } from '../features/file-system/file-system.component';
import { FileSystemObject } from '../features/file-system/file-system.model';

@Component({
  selector: 'sb-home',
  template: `
    <main class="home">
      <sb-file-system (selected)="selectedObj = $event" />

      @if (selectedObj?.file; as file) {
        <sb-file-preview [file]="file" />
      }
    </main>
  `,
  imports: [FileSystemComponent, FilePreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  selectedObj: FileSystemObject | null = null;
}
