import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT);

  isDark = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyDark(saved ? saved === 'dark' : prefersDark);
    }
  }

  toggle(): void {
    this.applyDark(!this.isDark());
  }

  private applyDark(dark: boolean): void {
    this.isDark.set(dark);
    this.doc.documentElement.classList.toggle('dark', dark);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    }
  }
}
