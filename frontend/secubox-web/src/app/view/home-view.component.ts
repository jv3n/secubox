import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FileSystemComponent } from '../features/file-system/file-system.component';

@Component({
  selector: 'sb-home',
  template: `
    <main class="home">
      <h1>Secubox</h1>

      <sb-file-system />
    </main>
  `,
  imports: [FileSystemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {}
