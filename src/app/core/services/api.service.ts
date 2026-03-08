import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  badge?: string;
  is_active: boolean;
  sort_order: number;
}

export interface AboutStat {
  id: string;
  value: string;
  label: string;
  sort_order: number;
}

export interface AboutValue {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
}

export interface ScheduleBlock {
  label: string;   // Ej: "Lun – Sáb"
  hours: string[]; // Ej: ["10:00 – 14:00", "19:00 – 22:00"]
}

export interface BusinessInfo {
  id: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  schedule: ScheduleBlock[];
  instagram_url?: string;
  facebook_url?: string;
  hero_badge: string;
  hero_headline: string;
  hero_headline_highlight: string;
  hero_subtitle: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // Cached so Hero and AppComponent share one HTTP request
  private businessInfo$ = this.http.get<BusinessInfo>(`${this.base}/api/business-info`).pipe(shareReplay(1));

  getProducts() {
    return this.http.get<Product[]>(`${this.base}/api/products`);
  }

  getAboutStats() {
    return this.http.get<AboutStat[]>(`${this.base}/api/about/stats`);
  }

  getAboutValues() {
    return this.http.get<AboutValue[]>(`${this.base}/api/about/values`);
  }

  getBusinessInfo() {
    return this.businessInfo$;
  }

  submitContact(data: ContactPayload) {
    return this.http.post(`${this.base}/api/contact`, data);
  }
}
