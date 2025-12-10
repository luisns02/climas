import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {
  // Lista de imágenes de placeholder por categoría
  private imagenesPorCategoria: { [key: string]: string[] } = {
    'hotel': [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    ],
    'attraction': [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1555992828-ca4b5008c7d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    ],
    'museum': [
      'https://images.unsplash.com/photo-1587231023525-7c8c6a7c7b8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    ],
    'restaurant': [
      'https://images.unsplash.com/photo-1414232071580-4d0e8ea8049c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    ],
    'default': [
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    ]
  };

  constructor(private http: HttpClient) {}

  /**
   * Obtiene una imagen para un lugar turístico basado en su nombre y tipo
   */
  obtenerImagenParaLugar(nombreLugar: string, tipoLugar: string, index: number): string {
    // Determinar la categoría basada en el tipo de lugar
    let categoria = 'default';
    const tipoLower = (tipoLugar || '').toLowerCase();
    const nombreLower = (nombreLugar || '').toLowerCase();

    if (tipoLower.includes('hotel') || nombreLower.includes('hotel') || 
        nombreLower.includes('residence') || nombreLower.includes('hostal')) {
      categoria = 'hotel';
    } else if (tipoLower.includes('museum') || nombreLower.includes('museo') || 
               nombreLower.includes('gallery') || nombreLower.includes('galería')) {
      categoria = 'museum';
    } else if (tipoLower.includes('restaurant') || nombreLower.includes('restaurante') || 
               nombreLower.includes('café') || nombreLower.includes('cafe')) {
      categoria = 'restaurant';
    } else if (tipoLower.includes('attraction') || nombreLower.includes('fontana') || 
               nombreLower.includes('fuente') || nombreLower.includes('monument')) {
      categoria = 'attraction';
    }

    // Obtener lista de imágenes para la categoría
    const imagenes = this.imagenesPorCategoria[categoria] || this.imagenesPorCategoria['default'];
    
    // Seleccionar imagen basada en el índice (para variedad)
    const imagenIndex = index % imagenes.length;
    return imagenes[imagenIndex];
  }

  /**
   * Método alternativo usando Unsplash API (requiere clave API)
   */
  buscarImagenUnsplash(query: string): Observable<string> {
    // Por ahora, devolvemos un observable con una imagen placeholder
    return of(this.obtenerImagenParaLugar(query, 'default', 0));
  }
}