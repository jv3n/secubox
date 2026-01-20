import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContextMenuDirective } from '../directive/context-menu.directive';
import { FileSystemObject } from '../file-system.model';

@Component({
  template: `
    <div id="target" [contextMenu]="file" (menuRequested)="onMenuRequested($event)" (menuClosed)="onMenuClosed()">
      Target
    </div>
  `,
  imports: [ContextMenuDirective],
})
class TestHostComponent {
  file: FileSystemObject = {
    id: '1',
    name: 'Documents',
    path: '/',
    childrens: [],
  };

  menuRequestedSpy = vi.fn();
  menuClosedSpy = vi.fn();

  onMenuRequested(event: any) {
    this.menuRequestedSpy(event);
  }

  onMenuClosed() {
    this.menuClosedSpy();
  }
}

describe('ContextMenuDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let targetEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    targetEl = fixture.debugElement.query(By.css('#target')).nativeElement;
  });

  it('should emit menuRequested on right click', () => {
    const event = new MouseEvent('contextmenu', {
      clientX: 100,
      clientY: 200,
      bubbles: true,
    });

    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

    targetEl.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopPropagationSpy).toHaveBeenCalled();

    expect(host.menuRequestedSpy).toHaveBeenCalledOnce();
    expect(host.menuRequestedSpy).toHaveBeenCalledWith({
      x: 100,
      y: 200,
      target: host.file,
    });
  });

  it('should emit menuClosed when clicking outside', () => {
    document.body.click();

    expect(host.menuClosedSpy).toHaveBeenCalledOnce();
  });

  it('should NOT emit menuClosed when clicking inside', () => {
    targetEl.click();

    expect(host.menuClosedSpy).not.toHaveBeenCalled();
  });
});
