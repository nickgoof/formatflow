import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { FormatFlowService } from '../shared/format-flow-service';
import { LanguageService, Language } from '../shared/language-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ff-pixel-component',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatButtonToggleModule, FormsModule, RouterLink],
  templateUrl: './pixel-component.html',
  styleUrl: './pixel-component.scss',
})
export class PixelComponent implements OnInit, OnDestroy {
  scale: string = '';
  selectedFile: File | null = null;
  compressionFactor: number = 2;
  upscaleFactor: number = 4;

  // SPRACHE
  currentLang: Language = 'de';
  private langSub!: Subscription;

  content = {
    de: {
      up_title: 'Bild aufwerten',
      up_subtitle: 'Wählen Sie ein kleines Bild zum aufskalieren.',
      down_title: 'Bild abwerten',
      down_subtitle: 'Wählen Sie ein Bild zum komprimieren und den Skalierungsfaktor.',

      select_title: 'Bild auswählen',
      select_desc: 'JPG, PNG, WEBP',

      ready_up: 'Bereit zum Aufwerten',
      ready_down: 'Bereit zum Abwerten',

      label_compress: 'Komprimierungsfaktor:',
      label_scale: 'Skalierungsfaktor:',

      btn_down: 'Abwerten',
      btn_up: 'Skalieren',
      btn_back: 'Startseite'
    },
    it: {
      up_title: 'Migliora qualità',
      up_subtitle: 'Scegli un\'immagine piccola da ingrandire.',
      down_title: 'Riduci dimensioni',
      down_subtitle: 'Scegli un\'immagine da comprimere e il fattore di scala.',

      select_title: 'Seleziona immagine',
      select_desc: 'JPG, PNG, WEBP',

      ready_up: 'Pronto per il miglioramento',
      ready_down: 'Pronto per la riduzione',

      label_compress: 'Fattore di compressione:',
      label_scale: 'Fattore di scala:',

      btn_down: 'Comprimi',
      btn_up: 'Scala',
      btn_back: 'Home'
    }
  };


  constructor(
    private route: ActivatedRoute,
    private ffservice: FormatFlowService,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => this.scale = params['scale']);

    // Sprache abonnieren
    this.langSub = this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  ngOnDestroy() {
    if (this.langSub) this.langSub.unsubscribe();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onUpscale(): void {
    if (this.selectedFile) {
      this.ffservice.upscaleImage(this.selectedFile, this.upscaleFactor).subscribe({
        next: (blob: Blob) => {
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = `upscaled_${this.selectedFile?.name}`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      });
    }
  }

  onDownscale(): void {
    if (this.selectedFile) {
      this.ffservice.downscaleImage(this.selectedFile, this.compressionFactor).subscribe({
        next: (blob: Blob) => {
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = `downscaled_${this.selectedFile?.name}`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      });
    }
  }
}
