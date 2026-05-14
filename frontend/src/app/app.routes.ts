import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { FormatComponent } from './format-component/format-component';
import { PixelComponent } from './pixel-component/pixel-component';
import { Home } from './home/home';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'home/format', component: FormatComponent },
  { path: 'home/pixel', redirectTo: 'home/pixel/upscaling', pathMatch: 'full' },
  { path: 'home/pixel/:scale', component: PixelComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
