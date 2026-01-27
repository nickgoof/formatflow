import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card'; // Wichtig!
import { MatToolbarModule } from '@angular/material/toolbar';
@Component({
  selector: 'ff-home',
  imports: [RouterModule, CommonModule, MatCardModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly title = signal('FormatFlow');
}
