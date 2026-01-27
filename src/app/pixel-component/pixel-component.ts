import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { FormatFlowService } from '../shared/format-flow-service';

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

  constructor(private route: ActivatedRoute, private ffservice: FormatFlowService) { }

  ngOnInit() {
    this.route.params.subscribe(params => this.scale = params['scale']);
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
      this.ffservice.downscaleImage(this.selectedFile, this.upscaleFactor).subscribe({
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
