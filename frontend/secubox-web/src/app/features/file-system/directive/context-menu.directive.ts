import { Directive, ElementRef, HostListener, inject, input, output } from '@angular/core';
import { FileSystemObject } from '../file-system.model';
import { ContextMenu } from './context-menu.model';

@Directive({ selector: '[contextMenu]' })
export class ContextMenuDirective {
  readonly el = inject(ElementRef<HTMLElement>);

  contextMenu = input.required<FileSystemObject | null>();

  menuRequested = output<ContextMenu>();
  menuClosed = output<void>();

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.menuRequested.emit({
      x: event.clientX,
      y: event.clientY,
      target: this.contextMenu(),
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (event.button === 2) {
      return;
    }

    const clickedInside = this.el.nativeElement.contains(event.target as Node);

    if (!clickedInside) {
      this.menuClosed.emit();
    }
  }
}
