import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { SmoothScrollDirective } from '../../shared/directives/smooth-scroll.directive';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, SmoothScrollDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  private api = inject(ApiService);
  businessInfo = toSignal(this.api.getBusinessInfo());
}
