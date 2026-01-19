import { Directive, ElementRef, HostListener, input, output } from '@angular/core';
import { FileSystemObject } from '../file-system.model';
import { FileSystemMouseContext } from './context-menu.model';

@Directive({ selector: '[contextMenu]' })
export class ContextMenuDirective {
  contextMenu = input.required<FileSystemObject | null>();

  menuRequested = output<FileSystemMouseContext>();
  menuClosed = output<void>();

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  /* === Clic droit : ouverture === */
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.menuRequested.emit({
      x: event.clientX,
      y: event.clientY,
      data: this.contextMenu(),
    });
  }

  /* === Clic gauche ailleurs : fermeture === */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.el.nativeElement.contains(event.target as Node);

    if (!clickedInside) {
      this.menuClosed.emit();
    }
  }
}
