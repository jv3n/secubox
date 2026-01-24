import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileSystemComponent } from '../features/file-system/file-system.component';

@Component({
  selector: 'sb-home',
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.scss',
  imports: [FileSystemComponent, MatIconModule, MatButtonModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  isMenuCollapsed = signal<boolean>(false);

  toggleMenu(): void {
    this.isMenuCollapsed.update((collapsed) => !collapsed);
  }
}
