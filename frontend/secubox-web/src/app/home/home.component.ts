import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: ` Hello `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {}
