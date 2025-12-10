import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa-ciudad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-ciudad.html',
  styleUrl: './mapa-ciudad.css',
})
export class MapaCiudadComponent implements OnChanges {

  @Input() lat!: number;
  @Input() lon!: number;

  mapa: any;

  ngOnChanges() {
    if (!this.lat || !this.lon) return;

    if (!this.mapa) {
      this.mapa = L.map('mapa').setView([this.lat, this.lon], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(this.mapa);
    } else {
      this.mapa.setView([this.lat, this.lon], 12);
    }

    L.marker([this.lat, this.lon]).addTo(this.mapa);
  }
}
