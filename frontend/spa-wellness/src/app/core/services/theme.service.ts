import { Injectable, signal, computed, effect } from '@angular/core';
import { environment } from '../../../environments/environment';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly currentTheme = signal<Theme>(this.getInitialTheme());

  readonly theme = computed(() => this.currentTheme());
  readonly isDark = computed(() => this.currentTheme() === 'dark');

  constructor() {
    effect(() => {
      const theme = this.currentTheme();
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(environment.themeKey, theme);
    });
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(environment.themeKey) as Theme | null;
    if (stored) return stored;
    return 'light';
  }

  toggleTheme(): void {
    this.currentTheme.update(t => (t === 'light' ? 'dark' : 'light'));
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }
}
