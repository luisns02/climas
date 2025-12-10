import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turismo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turismo.html',
  styleUrl: './turismo.css',
})
export class TurismoComponent {
  @Input() lugares: any[] = [];

  getTipoTexto(tipo: string): string {
    const tipos: {[key: string]: string} = {
      'hotel': 'Hotel',
      'attraction': 'Atracción',
      'museum': 'Museo',
      'restaurant': 'Restaurante',
      'viewpoint': 'Mirador',
      'guest_house': 'Casa de huéspedes',
      'apartment': 'Apartamento',
      'hostel': 'Hostal'
    };
    return tipos[tipo?.toLowerCase()] || 'Lugar turístico';
  }
}