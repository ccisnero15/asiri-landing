import { Directive, HostListener, Input, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appSmoothScroll]'
})
export class SmoothScrollDirective {
  @Input('appSmoothScroll') targetId!: string;
  private doc = inject(DOCUMENT);

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.preventDefault();
    const target = this.doc.getElementById(this.targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
