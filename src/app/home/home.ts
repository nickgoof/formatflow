import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card'; // Wichtig!
import { MatToolbarModule } from '@angular/material/toolbar';
import { LanguageService } from '../shared/language-service';

type Language = 'de' | 'it';
@Component({
  selector: 'ff-home',
  imports: [RouterModule, CommonModule, MatCardModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly title = signal('FormatFlow');

  currentLang: Language = 'de';

  // Wörterbuch (bleibt hier, oder wir lagern es später auch aus)
  content = {
    de: {
      nav_btn: 'IT',
      hero_title_1: 'Medienbearbeitung',
      hero_title_2: 'neu gedacht.',
      subtitle: 'Konvertieren, optimieren und skalieren Sie Ihre Bilder in Sekundenschnelle. Einfach, schnell und direkt im Browser.',
      card1_title: 'Format ändern',
      card1_desc: 'Wandeln Sie PNG in JPG, WebP und mehr um. Ohne Qualitätsverlust.',
      card1_btn: 'Jetzt konvertieren',
      card2_title: 'Bild aufwerten',
      card2_desc: 'Nutzen Sie KI-Upscaling, um niedrige Auflösungen scharf zu machen.',
      card2_btn: 'Bild aufwerten',
      card3_title: 'Bild abwerten',
      card3_desc: 'Reduzieren Sie die Dateigröße effizient für Web und Mail.',
      card3_btn: 'Bild abwerten'
    },
    it: {
      nav_btn: 'DE',
      hero_title_1: 'Elaborazione media',
      hero_title_2: 'reinventata.',
      subtitle: 'Converti, ottimizza e ridimensiona le tue immagini in pochi secondi. Semplice, veloce e direttamente nel browser.',
      card1_title: 'Cambia formato',
      card1_desc: 'Converti PNG in JPG, WebP e altro. Senza perdita di qualità.',
      card1_btn: 'Converti ora',
      card2_title: 'Migliora qualità',
      card2_desc: 'Usa l\'AI-Upscaling per rendere nitide le immagini a bassa risoluzione.',
      card2_btn: 'Migliora foto',
      card3_title: 'Riduci dimensioni',
      card3_desc: 'Riduci efficientemente la dimensione del file per Web e Mail.',
      card3_btn: 'Comprimi foto'
    }
  };

  // Service injecten
  constructor(private languageService: LanguageService) { }

  ngOnInit() {
    // Wir abonnieren den Service: Wenn sich die Sprache ändert, merken wir es hier
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  toggleLanguage() {
    const newLang = this.currentLang === 'de' ? 'it' : 'de';
    // Wir sagen dem Service Bescheid -> das aktualisiert ALLE Komponenten
    this.languageService.changeLanguage(newLang);
  }
}
