import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';

@Component({
  selector: 'sb-file-preview',
  template: `
    <div class="file-preview">
      @if (file()) {
        <div>Nom du fichier: {{ file().name }}</div>
      }

      @if (previewUrl()) {
        <img [src]="previewUrl()" alt="Preview" style="max-width: 500px; max-height: 500px;" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePreviewComponent {
  file = input.required<File>();
  previewUrl = signal<string | null>(null);

  constructor() {
    effect(() => {
      const f = this.file();
      if (f && f.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => this.previewUrl.set(reader.result as string);
        reader.readAsDataURL(f);
      } else {
        this.previewUrl.set(null);
      }
    });
  }
}
