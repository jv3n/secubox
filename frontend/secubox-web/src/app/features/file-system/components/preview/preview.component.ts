import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

type FileType = 'image' | 'pdf' | 'text' | 'unknown';

@Component({
  selector: 'sb-file-preview',
  template: `
    <div class="file-preview">
      @if (file()) {
        <div class="file-info">
          <h3>{{ file().name }}</h3>
          <p>Type: {{ file().type || 'inconnu' }} - Taille: {{ formatFileSize(file().size) }}</p>
        </div>
      }

      @switch (fileType()) {
        @case ('image') {
          <div class="image-viewer">
            @if (previewUrl()) {
              <img [src]="previewUrl()" [alt]="file().name" />
            }
          </div>
        }
        @case ('pdf') {
          <div class="pdf-viewer">
            @if (safePdfUrl()) {
              <iframe [src]="safePdfUrl()" frameborder="0"></iframe>
            }
          </div>
        }
        @case ('text') {
          <div class="text-viewer">
            @if (textContent()) {
              <pre>{{ textContent() }}</pre>
            }
          </div>
        }
        @default {
          <div class="unsupported">
            <p>Aperçu non disponible pour ce type de fichier</p>
            <p>Types supportés: images (PNG, JPG, GIF, etc.), PDF, fichiers texte</p>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .file-preview {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        height: 100%;
        padding: 1rem;
      }

      .file-info {
        border-bottom: 1px solid var(--mat-sys-outline-variant);
        padding-bottom: 0.5rem;
      }

      .file-info h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.2rem;
        color: var(--mat-sys-on-surface);
      }

      .file-info p {
        margin: 0;
        color: var(--mat-sys-on-surface-variant);
        font-size: 0.9rem;
      }

      .image-viewer {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: auto;
        background-color: var(--mat-sys-surface-dim);
        border-radius: 8px;
      }

      .image-viewer img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      .pdf-viewer {
        flex: 1;
        display: flex;
      }

      .pdf-viewer iframe {
        width: 100%;
        height: 100%;
        min-height: 600px;
        border-radius: 8px;
      }

      .text-viewer {
        flex: 1;
        overflow: auto;
        background-color: var(--mat-sys-surface-container-highest);
        border-radius: 8px;
        border: 1px solid var(--mat-sys-outline-variant);
      }

      .text-viewer pre {
        margin: 0;
        padding: 1rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        white-space: pre-wrap;
        word-wrap: break-word;
        color: var(--mat-sys-on-surface);
      }

      .unsupported {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--mat-sys-on-surface-variant);
        text-align: center;
        padding: 2rem;
      }

      .unsupported p {
        margin: 0.5rem 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePreviewComponent {
  file = input.required<File>();
  previewUrl = signal<string | null>(null);
  safePdfUrl = signal<SafeResourceUrl | null>(null);
  textContent = signal<string | null>(null);

  fileType = computed<FileType>(() => {
    const f = this.file();
    if (!f) return 'unknown';

    if (f.type.startsWith('image/')) return 'image';
    if (f.type === 'application/pdf') return 'pdf';
    if (f.type.startsWith('text/') || this.isTextFile(f.name)) return 'text';

    return 'unknown';
  });

  constructor(private sanitizer: DomSanitizer) {
    effect(() => {
      const f = this.file();
      const type = this.fileType();

      // Reset all preview states
      this.previewUrl.set(null);
      this.safePdfUrl.set(null);
      this.textContent.set(null);

      if (!f) return;

      const reader = new FileReader();

      switch (type) {
        case 'image':
          reader.onload = () => this.previewUrl.set(reader.result as string);
          reader.readAsDataURL(f);
          break;

        case 'pdf':
          reader.onload = () => {
            const blob = new Blob([reader.result as ArrayBuffer], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            this.safePdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
          };
          reader.readAsArrayBuffer(f);
          break;

        case 'text':
          reader.onload = () => this.textContent.set(reader.result as string);
          reader.readAsText(f);
          break;
      }
    });
  }

  private isTextFile(filename: string): boolean {
    const textExtensions = [
      '.txt',
      '.md',
      '.json',
      '.xml',
      '.csv',
      '.log',
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.css',
      '.scss',
      '.html',
      '.java',
      '.py',
      '.rb',
      '.php',
      '.c',
      '.cpp',
      '.h',
      '.sh',
      '.yml',
      '.yaml',
      '.toml',
      '.ini',
      '.conf',
      '.config',
    ];
    return textExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
