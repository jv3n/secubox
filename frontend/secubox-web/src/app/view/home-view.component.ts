import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FileSystemComponent } from '../features/file-system/file-system.component';

@Component({
  selector: 'sb-home',
  template: `
    <main class="home">
      <sb-file-system />
    </main>
  `,
  imports: [FileSystemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {}
