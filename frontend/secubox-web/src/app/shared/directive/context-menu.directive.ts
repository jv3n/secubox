import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[contextMenu]',
  standalone: true,
})
export class ContextMenuDirective<T = any> {
  @Input('contextMenu') data!: T;

  @Output() menuRequested = new EventEmitter<{
    x: number;
    y: number;
    data: T;
  }>();

  @Output() menuClosed = new EventEmitter<void>();

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  /* === Clic droit : ouverture === */
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.menuRequested.emit({
      x: event.clientX,
      y: event.clientY,
      data: this.data,
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
