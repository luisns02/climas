import { Routes } from '@angular/router';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida';
import { AppComponent } from './app';

export const routes: Routes = [
  { 
    path: 'bienvenida', 
    component: BienvenidaComponent 
  },
  { 
    path: '', 
    component: AppComponent,
    pathMatch: 'full'
  },
  { 
    path: '**', 
    redirectTo: 'bienvenida' 
  }
];