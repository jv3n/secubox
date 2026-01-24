import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Récupérer la préférence sauvegardée ou utiliser la préférence système
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }

    // Appliquer le thème initial
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode.update((current) => !current);
    this.applyTheme();
  }

  private applyTheme(): void {
    const htmlElement = document.documentElement;
    const theme = this.isDarkMode() ? 'dark' : 'light';

    if (this.isDarkMode()) {
      htmlElement.classList.add('dark-theme');
    } else {
      htmlElement.classList.remove('dark-theme');
    }

    localStorage.setItem('theme', theme);
  }
}
