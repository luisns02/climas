import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { GeografiaService } from '../../servicios/geografia';

@Component({
  selector: 'app-foto-geografica',
  templateUrl: './foto-geografica.html',
  styleUrls: ['./foto-geografica.css'],
  imports: [CommonModule]
})
export class FotoGeograficaComponent implements OnInit, OnChanges {
  @Input() ciudad: string = '';
  @Input() lat: number = 0;
  @Input() lon: number = 0;
  @Input() clima: any;
  
  fotoUrl: string = '';
  geografia: string = '';
  descripcion: string = '';
  isLoading: boolean = false;
  iconoGeografia: string = '📍';
  error: string = '';
  
  private readonly iconosGeografia: { [key: string]: string } = {
    'COSTA': '🌊',
    'ISLA': '🏝️',
    'MONTAÑA': '⛰️',
    'COLINA': '🌄',
    'BOSQUE': '🌳',
    'LAGO': '🏞️',
    'CAMPO': '🌾',
    'DESIERTO': '🏜️',
    'CIUDAD': '🏙️'
  };

  constructor(private geografiaService: GeografiaService) {}

  ngOnInit() {
    if (this.lat && this.lon) {
      this.cargarFotoGeografia();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['lat'] || changes['lon'] || changes['ciudad']) && this.lat && this.lon) {
      this.cargarFotoGeografia();
    }
  }

  cargarFotoGeografia() {
    this.isLoading = true;
    this.error = '';
    
    this.geografiaService.detectarGeografia(this.lat, this.lon).pipe(
      switchMap((geografia: string) => {
        this.geografia = geografia;
        this.iconoGeografia = this.iconosGeografia[geografia] || '📍';
        this.descripcion = this.geografiaService.obtenerDescripcionGeografia(
          geografia, 
          this.ciudad, 
          this.clima
        );
        
        return this.geografiaService.obtenerFotoGeografia(geografia, this.clima, this.ciudad);
      })
    ).subscribe({
      next: (url: string) => {
        this.fotoUrl = url;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando foto geográfica:', error);
        this.error = 'No se pudo cargar la imagen geográfica';
        this.fotoUrl = this.obtenerFotoAlternativa();
        this.isLoading = false;
      }
    });
  }

  // MÉTODO NUEVO para redondear temperatura
  redondearTemperatura(temperatura: number): number {
    return Math.round(temperatura);
  }

  private obtenerFotoAlternativa(): string {
    const fotos: { [key: string]: string } = {
      'COSTA': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      'ISLA': 'https://images.unsplash.com/photo-1516496636080-14fb876e029d?w=1200',
      'MONTAÑA': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200',
      'COLINA': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      'BOSQUE': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
      'LAGO': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
      'CAMPO': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
      'DESIERTO': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      'CIUDAD': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200'
    };
    
    return fotos[this.geografia] || fotos['CIUDAD'];
  }

  onImageLoad() {
    console.log('✅ Imagen cargada correctamente');
  }

  obtenerIconoClima(): string {
    if (!this.clima?.weathercode) return '🌈';
    
    const iconos: { [key: number]: string } = {
      0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️❄️',
      51: '🌦️', 53: '🌧️', 55: '🌧️💧', 61: '🌧️', 63: '🌧️💦',
      65: '⛈️', 71: '🌨️', 73: '❄️', 75: '❄️⛄', 80: '🌦️',
      81: '🌧️', 82: '⛈️', 95: '⛈️⚡', 96: '⛈️⚡', 99: '⛈️⚡🌀'
    };
    
    return iconos[this.clima.weathercode] || '🌈';
  }

  obtenerColorTemperatura(): string {
    if (!this.clima?.temperature) return 'var(--color-texto)';
    
    const temp = this.clima.temperature;
    if (temp > 30) return '#ff6b6b'; // Rojo para calor
    if (temp > 25) return '#ffa726'; // Naranja
    if (temp > 20) return '#4caf50'; // Verde
    if (temp > 10) return '#2196f3'; // Azul
    if (temp > 0) return '#64b5f6'; // Azul claro
    return '#bbdefb'; // Azul muy claro para frío
  }
}