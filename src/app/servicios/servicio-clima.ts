import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicioClima {

  constructor(private http: HttpClient) {}

  buscarCiudad(nombre: string): Observable<any> {
    return this.http.get(
      `https://nominatim.openstreetmap.org/search?q=${nombre}&format=json&limit=1`
    );
  }

  obtenerClima(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&current_weather=true&timezone=auto`
    );
  }

  obtenerClimaPorHoras(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode,windspeed_10m&timezone=auto&forecast_days=1`
    );
  }

  obtenerTurismo(lat: number, lon: number): Observable<any> {
    const consulta = `
      [out:json];
      (
        node["tourism"](around:3000,${lat},${lon});
        way["tourism"](around:3000,${lat},${lon});
        relation["tourism"](around:3000,${lat},${lon});
      );
      out center;
    `;
    return this.http.get(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(consulta)}`
    );
  }
}
