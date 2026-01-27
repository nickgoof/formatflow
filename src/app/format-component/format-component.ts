import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterLink } from "@angular/router";
import { FormatFlowService } from '../shared/format-flow-service';

@Component({
  selector: 'ff-format-component',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatButtonToggleModule, FormsModule, RouterLink],
  templateUrl: './format-component.html',
  styleUrl: './format-component.scss',
  providers: [FormatFlowService]
})
export class FormatComponent {
  selectedFile: File | null = null;
  formats: string[] = ['jpg', 'png', 'webp', 'pdf', 'tiff'];
  sourceFormat: string = '';
  targetFormat: string | null = null;

  constructor(private ffservice: FormatFlowService) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.detectSourceFormat(file.name);

      // Falls das Zielformat zufällig das gleiche wie das neue Quellformat ist -> zurücksetzen
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
      this.ffservice.convertFile(this.selectedFile, this.targetFormat).subscribe({
        next: (blob: Blob) => {
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = `converted.${this.targetFormat}`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      });
    }
  }
}
