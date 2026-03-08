import { Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { SmoothScrollDirective } from '../../shared/directives/smooth-scroll.directive';
import { ApiService } from '../../core/services/api.service';

const PER_SLIDE = 3;

@Component({
  selector: 'app-products',
  imports: [NgOptimizedImage, SmoothScrollDirective],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private api = inject(ApiService);
  products = toSignal(this.api.getProducts(), { initialValue: [] });

  currentSlide = signal(0);
  direction = signal<'next' | 'prev'>('next');

  totalSlides = computed(() => Math.ceil(this.products().length / PER_SLIDE));

  visibleProducts = computed(() => {
    const start = this.currentSlide() * PER_SLIDE;
    return this.products().slice(start, start + PER_SLIDE);
  });

  prev() {
    this.direction.set('prev');
    this.currentSlide.update(v => Math.max(0, v - 1));
  }

  next() {
    this.direction.set('next');
    this.currentSlide.update(v => Math.min(this.totalSlides() - 1, v + 1));
  }
}
