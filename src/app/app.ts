import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from "@angular/router";


@Component({
  selector: 'ff-root',
  imports: [RouterModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('FormatFlow');
}
