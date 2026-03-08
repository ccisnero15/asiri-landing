import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService, ScheduleBlock } from '../../core/services/api.service';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private platformId = inject(PLATFORM_ID);
  private api        = inject(ApiService);

  submitted    = signal(false);
  businessInfo = toSignal(this.api.getBusinessInfo());
  form: ContactForm = { name: '', email: '', phone: '', message: '' };

  schedule = computed<ScheduleBlock[]>(() => {
    const raw = this.businessInfo()?.schedule;
    if (!raw) return [];
    if (typeof raw === 'string') return JSON.parse(raw);
    return raw;
  });

  onSubmit(ngForm: NgForm): void {
    if (ngForm.invalid) return;

    this.api.submitContact({
      name:    this.form.name,
      email:   this.form.email,
      phone:   this.form.phone || undefined,
      message: this.form.message
    }).subscribe();

    const waNumber = this.businessInfo()?.whatsapp_number ?? '';
    const text     = encodeURIComponent(
      `Hola Asiri! Soy ${this.form.name}.\n\n${this.form.message}\n\nCorreo: ${this.form.email}`
    );

    if (isPlatformBrowser(this.platformId) && waNumber) {
      window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank', 'noopener');
    }

    this.submitted.set(true);
  }
}
