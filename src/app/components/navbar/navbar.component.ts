import { Component, inject, signal, HostListener } from '@angular/core';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { SmoothScrollDirective } from '../../shared/directives/smooth-scroll.directive';
import { ThemeService } from '../../core/services/theme.service';

interface NavLink {
  label: string;
  targetId: string;
}

@Component({
  selector: 'app-navbar',
  imports: [NgOptimizedImage, SmoothScrollDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private doc = inject(DOCUMENT);
  theme = inject(ThemeService);

  isScrolled = signal(false);
  mobileMenuOpen = signal(false);

  navLinks: NavLink[] = [
    { label: 'Inicio',         targetId: 'inicio' },
    { label: 'Sobre Nosotros', targetId: 'sobre-nosotros' },
    { label: 'Productos',      targetId: 'productos' },
    { label: 'Almacén',        targetId: 'almacen' },
    { label: 'Contacto',       targetId: 'contacto' }
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(this.doc.documentElement.scrollTop > 60);
  }

  toggleMobile(): void {
    this.mobileMenuOpen.update(v => !v);
  }
}
