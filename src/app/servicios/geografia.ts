// servicios/geografia.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GeografiaService {
  private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
  private readonly OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
  private readonly UNSPLASH_ACCESS_KEY = 'TU_CLAVE_UNSPLASH'; // Gratis: unsplash.com/developers

  constructor(private http: HttpClient) {}

  // Detectar características geográficas de una ciudad
  detectarGeografia(lat: number, lon: number): Observable<any> {
    // Consultar múltiples características en paralelo
    return forkJoin({
      altura: this.obtenerAltitud(lat, lon),
      agua: this.detectarCuerposAgua(lat, lon),
      relieve: this.detectarRelieve(lat, lon),
      usoSuelo: this.detectarUsoSuelo(lat, lon)
    }).pipe(
      map(resultados => this.procesarGeografia(resultados, lat, lon))
    );
  }

  private obtenerAltitud(lat: number, lon: number): Observable<number> {
    const url = `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`;
    return this.http.get<any>(url).pipe(
      map(data => data.results[0]?.elevation || 0),
      catchError(() => of(0))
    );
  }

  private detectarCuerposAgua(lat: number, lon: number): Observable<any> {
    const consulta = `
      [out:json];
      (
        way["natural"="water"](around:5000,${lat},${lon});
        way["waterway"](around:5000,${lat},${lon});
        way["natural"="coastline"](around:10000,${lat},${lon});
        relation["natural"="water"](around:5000,${lat},${lon});
      );
      out count;
    `;
    
    return this.http.get<any>(`${this.OVERPASS_URL}?data=${encodeURIComponent(consulta)}`).pipe(
      map(data => ({
        tieneAgua: data.elements.length > 0,
        esCosta: data.elements.some((el: any) => el.tags?.natural === 'coastline'),
        numCuerposAgua: data.elements.length
      })),
      catchError(() => of({ tieneAgua: false, esCosta: false, numCuerposAgua: 0 }))
    );
  }

  private detectarRelieve(lat: number, lon: number): Observable<any> {
    const consulta = `
      [out:json];
      (
        way["natural"="peak"](around:10000,${lat},${lon});
        way["natural"="ridge"](around:10000,${lat},${lon});
        way["natural"="valley"](around:10000,${lat},${lon});
        way["natural"="cliff"](around:10000,${lat},${lon});
      );
      out count;
    `;
    
    return this.http.get<any>(`${this.OVERPASS_URL}?data=${encodeURIComponent(consulta)}`).pipe(
      map(data => ({
        tieneMontaña: data.elements.some((el: any) => el.tags?.natural === 'peak'),
        tieneColina: data.elements.some((el: any) => el.tags?.natural === 'ridge'),
        numElementosRelieve: data.elements.length
      })),
      catchError(() => of({ tieneMontaña: false, tieneColina: false, numElementosRelieve: 0 }))
    );
  }

  private detectarUsoSuelo(lat: number, lon: number): Observable<any> {
    const consulta = `
      [out:json];
      (
        way["landuse"="forest"](around:5000,${lat},${lon});
        way["landuse"="farmland"](around:5000,${lat},${lon});
        way["landuse"="meadow"](around:5000,${lat},${lon});
        way["natural"="wood"](around:5000,${lat},${lon});
        way["natural"="scrub"](around:5000,${lat},${lon});
      );
      out count;
    `;
    
    return this.http.get<any>(`${this.OVERPASS_URL}?data=${encodeURIComponent(consulta)}`).pipe(
      map(data => ({
        tieneBosque: data.elements.some((el: any) => 
          el.tags?.landuse === 'forest' || el.tags?.natural === 'wood'
        ),
        tieneCampo: data.elements.some((el: any) => 
          el.tags?.landuse === 'farmland' || el.tags?.landuse === 'meadow'
        ),
        tieneMatorral: data.elements.some((el: any) => el.tags?.natural === 'scrub')
      })),
      catchError(() => of({ tieneBosque: false, tieneCampo: false, tieneMatorral: false }))
    );
  }

  private procesarGeografia(resultados: any, lat: number, lon: number): string {
    const { altura, agua, relieve, usoSuelo } = resultados;
    
    // Determinar tipo de geografía
    if (agua.esCosta) {
      return 'COSTA';
    } else if (altura > 1000) {
      return 'MONTAÑA';
    } else if (altura > 500) {
      return 'COLINA';
    } else if (agua.tieneAgua && agua.numCuerposAgua > 2) {
      return 'LAGO';
    } else if (usoSuelo.tieneBosque) {
      return 'BOSQUE';
    } else if (usoSuelo.tieneCampo) {
      return 'CAMPO';
    } else if (this.esIsla(lat, lon)) {
      return 'ISLA';
    } else if (this.esDesierto(lat, lon)) {
      return 'DESIERTO';
    } else {
      return 'CIUDAD';
    }
  }

  private esIsla(lat: number, lon: number): boolean {
    // Simple check basado en latitud (islas tropicales)
    return Math.abs(lat) < 30;
  }

  private esDesierto(lat: number, lon: number): boolean {
    // Zonas desérticas conocidas
    const desiertos = [
      { lat: 23, lon: 13, radio: 15 },   // Sahara
      { lat: 30, lon: 0, radio: 10 },    // Norte de África
      { lat: 25, lon: 45, radio: 12 },   // Arabia
      { lat: 35, lon: -115, radio: 10 }, // Mojave
      { lat: -24, lon: 135, radio: 15 }  // Australia
    ];
    
    return desiertos.some(d => 
      this.calcularDistancia(lat, lon, d.lat, d.lon) < d.radio
    );
  }

  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Obtener foto según geografía y clima
  obtenerFotoGeografia(geografia: string, clima: any, ciudad: string): Observable<string> {
    const query = this.crearQueryUnsplash(geografia, clima, ciudad);
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${this.UNSPLASH_ACCESS_KEY}`;
    
    return this.http.get<any>(url).pipe(
      map(data => {
        if (data.results.length > 0) {
          return data.results[0].urls.regular;
        } else {
          return this.obtenerFotoPorDefecto(geografia, clima);
        }
      }),
      catchError(() => of(this.obtenerFotoPorDefecto(geografia, clima)))
    );
  }

  private crearQueryUnsplash(geografia: string, clima: any, ciudad: string): string {
    const descripcionClima = this.obtenerDescripcionClima(clima?.weathercode);
    const estacion = this.obtenerEstacion();
    
    const queries: { [key: string]: string } = {
      'COSTA': `${ciudad} coastline beach ocean ${descripcionClima} ${estacion} landscape`,
      'ISLA': `${ciudad} island tropical ${descripcionClima} paradise`,
      'MONTAÑA': `${ciudad} mountain peak snowy ${descripcionClima} alpine`,
      'COLINA': `${ciudad} hills landscape ${descripcionClima} ${estacion}`,
      'BOSQUE': `${ciudad} forest trees ${descripcionClima} ${estacion} woodland`,
      'LAGO': `${ciudad} lake water ${descripcionClima} reflection`,
      'CAMPO': `${ciudad} countryside field farmland ${descripcionClima}`,
      'DESIERTO': `${ciudad} desert sand dunes ${descripcionClima}`,
      'CIUDAD': `${ciudad} city skyline urban ${descripcionClima}`
    };
    
    return queries[geografia] || `${ciudad} landscape ${descripcionClima}`;
  }

  private obtenerDescripcionClima(weathercode: number): string {
    const descripciones: { [key: number]: string } = {
      0: 'sunny', 1: 'clear sky', 2: 'partly cloudy', 3: 'cloudy',
      45: 'foggy', 48: 'foggy', 51: 'drizzle', 53: 'rainy',
      55: 'rainy', 61: 'rain', 63: 'rain', 65: 'storm',
      71: 'snow', 73: 'snow', 75: 'snowstorm', 80: 'showers',
      81: 'rain', 82: 'storm', 95: 'thunderstorm',
      96: 'storm', 99: 'thunderstorm'
    };
    return descripciones[weathercode] || '';
  }

  private obtenerEstacion(): string {
    const mes = new Date().getMonth() + 1;
    if (mes >= 3 && mes <= 5) return 'spring';
    if (mes >= 6 && mes <= 8) return 'summer';
    if (mes >= 9 && mes <= 11) return 'autumn';
    return 'winter';
  }

  private obtenerFotoPorDefecto(geografia: string, clima: any): string {
    // Fotos por defecto según geografía
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

    // Ajustar foto según clima
    let foto = fotos[geografia] || fotos['CIUDAD'];
    
    // Si hace mucho calor, ajustar para mostrar calor
    if (clima?.temperature > 30) {
      foto = this.agregarEfectoCalor(foto);
    }
    // Si hace frío o nieva, ajustar para mostrar frío
    else if (clima?.temperature < 5 || [71, 73, 75].includes(clima?.weathercode)) {
      foto = this.agregarEfectoFrio(foto);
    }
    
    return foto;
  }

  private agregarEfectoCalor(fotoUrl: string): string {
    // Para fotos de calor (añadir parámetros de filtro)
    return `${fotoUrl}&auto=format&fit=crop&w=1200&q=80&sat=50&blur=20`;
  }

  private agregarEfectoFrio(fotoUrl: string): string {
    // Para fotos de frío (azulado)
    return `${fotoUrl}&auto=format&fit=crop&w=1200&q=80&sat=30&blur=10`;
  }

  // Obtener descripción textual de la geografía
  obtenerDescripcionGeografia(geografia: string, ciudad: string, clima: any): string {
    const descripciones: { [key: string]: string } = {
      'COSTA': `🌊 ${ciudad} está situada junto a la costa. Disfruta de la brisa marina`,
      'ISLA': `🏝️ ${ciudad} es una isla. Clima tropical y playas paradisíacas`,
      'MONTAÑA': `⛰️ ${ciudad} está en zona montañosa. Aire puro y vistas espectaculares`,
      'COLINA': `🌄 ${ciudad} se encuentra en zona de colinas. Paisajes ondulados`,
      'BOSQUE': `🌳 ${ciudad} rodeada de bosques. Naturaleza y tranquilidad`,
      'LAGO': `🏞️ ${ciudad} cerca de lagos. Agua cristalina y serenidad`,
      'CAMPO': `🌾 ${ciudad} en zona rural. Campos verdes y paz`,
      'DESIERTO': `🏜️ ${ciudad} en zona desértica. Días cálidos y noches frescas`,
      'CIUDAD': `🏙️ ${ciudad} es una zona urbana. Edificios y vida ciudadana`
    };

    let descripcion = descripciones[geografia] || `📍 ${ciudad}`;
    
    // Añadir info del clima
    if (clima?.temperature > 30) {
      descripcion += `. 🔥 Temperatura muy cálida`;
    } else if (clima?.temperature > 25) {
      descripcion += `. ☀️ Días cálidos`;
    } else if (clima?.temperature < 5) {
      descripcion += `. ❄️ Temperatura fría`;
    } else if (clima?.temperature < 10) {
      descripcion += `. 🧥 Días frescos`;
    }

    return descripcion;
  }
}