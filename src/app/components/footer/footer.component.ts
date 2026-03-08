import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { SmoothScrollDirective } from '../../shared/directives/smooth-scroll.directive';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-footer',
  imports: [NgOptimizedImage, SmoothScrollDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private api = inject(ApiService);

  businessInfo = toSignal(this.api.getBusinessInfo());
  year = new Date().getFullYear();

  links = [
    { label: 'Inicio',         targetId: 'inicio' },
    { label: 'Sobre Nosotros', targetId: 'sobre-nosotros' },
    { label: 'Productos',      targetId: 'productos' },
    { label: 'Contacto',       targetId: 'contacto' }
  ];
}
