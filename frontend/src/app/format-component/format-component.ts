import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterLink } from "@angular/router";
import { FormatFlowService } from '../shared/format-flow-service';
import { LanguageService, Language } from '../shared/language-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ff-format-component',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatButtonToggleModule, FormsModule, RouterLink],
  templateUrl: './format-component.html',
  styleUrl: './format-component.scss',
  providers: [FormatFlowService]
})
export class FormatComponent implements OnInit, OnDestroy {
  selectedFile: File | null = null;
  formats: string[] = ['jpg', 'png', 'webp', 'pdf', 'tiff'];
  sourceFormat: string = '';
  targetFormat: string | null = null;
  isLoading: boolean = false;

  // SPRACHE
  currentLang: Language = 'de';
  private langSub!: Subscription;

  content = {
    de: {
      title: 'Format konvertieren',
      subtitle: 'Wählen Sie ein Bild und das neue Zielformat.',
      select_empty_title: 'Datei auswählen',
      select_empty_desc: 'JPG, PNG, WEBP, PDF, TIFF',
      target_label: 'Zielformat:',
      btn_convert: 'Konvertieren',
      btn_loading: 'Verarbeite...',
      btn_back: 'Startseite'
    },
    it: {
      title: 'Cambia formato',
      subtitle: 'Scegli un\'immagine e il nuovo formato di destinazione.',
      select_empty_title: 'Seleziona file',
      select_empty_desc: 'JPG, PNG, WEBP, PDF, TIFF',
      target_label: 'Formato destinazione:',
      btn_convert: 'Converti',
      btn_loading: 'Elaborazione...',
      btn_back: 'Home'
    }
  };

  constructor(
    private ffservice: FormatFlowService,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    // Hier holen wir uns die Sprache aus dem globalen Speicher
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
      this.detectSourceFormat(file.name);

      if (this.targetFormat === this.sourceFormat) {
        this.targetFormat = null;
      }
    }
  }

  detectSourceFormat(filename: string): void {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    if (extension === 'jpeg') this.sourceFormat = 'jpg';
    else if (extension === 'tif') this.sourceFormat = 'tiff';
    else this.sourceFormat = extension;
  }

  onConvert(): void {
    if (this.selectedFile && this.targetFormat) {
      this.isLoading = true;
      this.ffservice.convertFile(this.selectedFile, this.targetFormat).subscribe({
        next: (blob: Blob) => {
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = `converted.${this.targetFormat}`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Fehler beim Konvertieren:", err);
          alert("Fehler bei der Konvertierung. Bitte versuche es erneut.");
          this.isLoading = false;
        }
      });
    }
  }
}
