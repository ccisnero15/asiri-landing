import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-supplies',
  templateUrl: './supplies.component.html',
  styleUrl: './supplies.component.scss',
})
export class SuppliesComponent {
  private api = inject(ApiService);

  supplies = toSignal(this.api.getSupplies(), { initialValue: [] });
  businessInfo = toSignal(this.api.getBusinessInfo());

  activeCategory = signal<string | null>(null);

  categories = computed(() => [...new Set(this.supplies().map((s) => s.category))]);

  filteredSupplies = computed(() => {
    const cat = this.activeCategory();
    return cat ? this.supplies().filter((s) => s.category === cat) : this.supplies();
  });

  setCategory(cat: string | null): void {
    this.activeCategory.set(cat);
  }

  whatsappUrl(productName: string): string {
    const info = this.businessInfo();
    if (!info) return '#';
    const message = encodeURIComponent(`Hola! Quisiera consultar sobre: ${productName}`);
    return `https://wa.me/${info.whatsapp_number}?text=${message}`;
  }
}
