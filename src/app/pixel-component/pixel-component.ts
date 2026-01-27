import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'ff-pixel-component',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatButtonToggleModule, FormsModule, RouterLink],
  templateUrl: './pixel-component.html',
  styleUrl: './pixel-component.scss',
})
export class PixelComponent {
  scale: string = '';
  selectedFile: File | null = null;
  upscaleFactor: number = 2;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => this.scale = params['scale']);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onUpload(): void {
    if (this.selectedFile) {
      console.log(`Sende Datei: ${this.selectedFile.name} mit Faktor: ${this.upscaleFactor}x`);
      // Hier kommt später dein HTTP-Request hin
    }
  }

}
