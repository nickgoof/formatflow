import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'de' | 'it';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // BehaviorSubject speichert den aktuellen Wert und gibt ihn an alle Abonnenten weiter
  private languageSource = new BehaviorSubject<Language>('de');

  // Das ist das Observable, das die Komponenten beobachten (abonnieren) können
  currentLanguage$ = this.languageSource.asObservable();

  constructor() { }

  // Methode um die Sprache zu ändern
  changeLanguage(lang: Language) {
    this.languageSource.next(lang);
  }

  // Hilfsmethode, um den aktuellen Wert direkt zu bekommen (ohne Observable)
  getCurrentLanguageValue(): Language {
    return this.languageSource.value;
  }
}
