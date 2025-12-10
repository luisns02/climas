import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private nombreUsuario = new BehaviorSubject<string>('');
  nombreUsuario$ = this.nombreUsuario.asObservable();
  
  private readonly USUARIOS_KEY = 'usuariosClimass';
  private readonly USUARIO_ACTIVO_KEY = 'usuarioActivo';

  // Obtener todos los usuarios guardados
  getUsuarios(): string[] {
    const usuarios = localStorage.getItem(this.USUARIOS_KEY);
    return usuarios ? JSON.parse(usuarios) : [];
  }

  // Guardar un nuevo usuario
  agregarUsuario(nombre: string): void {
    const usuarios = this.getUsuarios();
    if (!usuarios.includes(nombre)) {
      usuarios.push(nombre);
      localStorage.setItem(this.USUARIOS_KEY, JSON.stringify(usuarios));
    }
  }

  // Eliminar un usuario
  eliminarUsuario(nombre: string): void {
    const usuarios = this.getUsuarios().filter(user => user !== nombre);
    localStorage.setItem(this.USUARIOS_KEY, JSON.stringify(usuarios));
    
    // Si el usuario eliminado es el activo, limpiar
    if (this.getNombreUsuario() === nombre) {
      this.limpiarUsuario();
    }
  }

  // Obtener usuario activo
  getNombreUsuario(): string {
    return localStorage.getItem(this.USUARIO_ACTIVO_KEY) || '';
  }

  // Establecer usuario activo
  setNombreUsuario(nombre: string): void {
    // Agregar a la lista de usuarios si no existe
    this.agregarUsuario(nombre);
    
    // Establecer como usuario activo
    localStorage.setItem(this.USUARIO_ACTIVO_KEY, nombre);
    this.nombreUsuario.next(nombre);
  }

  // Limpiar usuario activo (cerrar sesión)
  limpiarUsuario(): void {
    localStorage.removeItem(this.USUARIO_ACTIVO_KEY);
    this.nombreUsuario.next('');
  }

  // Cambiar entre usuarios
  cambiarUsuario(nuevoUsuario: string): void {
    this.setNombreUsuario(nuevoUsuario);
  }

  // Verificar si hay usuario activo
  estaLogueado(): boolean {
    return !!this.getNombreUsuario();
  }

  // Obtener número de usuarios registrados
  getNumeroUsuarios(): number {
    return this.getUsuarios().length;
  }

  obtenerRecomendacionClima(codigoClima: number, temperatura: number): string {
    // ... tu código existente ...
    let recomendacion = '';

    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(codigoClima)) {
      recomendacion = '🌧️ Lleva paraguas y chubasquero';
    } else if ([71, 73, 75, 77, 85, 86].includes(codigoClima)) {
      recomendacion = '❄️ Abrígate bien con ropa térmica';
    } else if ([95, 96, 99].includes(codigoClima)) {
      recomendacion = '⚡ Evita salir durante la tormenta';
    } else if ([1, 2, 3].includes(codigoClima)) {
      recomendacion = '⛅ Lleva una chaqueta ligera';
    } else if (codigoClima === 0) {
      recomendacion = '☀️ Día despejado, perfecto para salir';
    }

    if (temperatura < 0) {
      recomendacion += ' ❄️ Temperatura bajo cero';
    } else if (temperatura < 10) {
      recomendacion += ' 🧥 Abrigo grueso necesario';
    } else if (temperatura < 20) {
      recomendacion += ' 🧣 Chaqueta ligera recomendada';
    } else if (temperatura > 30) {
      recomendacion += ' 🥵 Ropa ligera y protector solar';
    } else if (temperatura > 25) {
      recomendacion += ' ☀️ Ropa fresca y sombrero';
    }

    return recomendacion;
  }

  obtenerEmoticonClima(codigoClima: number): string {
    const emoticonos: { [key: number]: string } = {
      0: '☀️',
      1: '🌤️',
      2: '⛅',
      3: '☁️',
      45: '🌫️',
      48: '🌫️❄️',
      51: '🌦️',
      53: '🌧️',
      55: '🌧️💧',
      61: '🌧️',
      63: '🌧️💦',
      65: '🌧️💦💨',
      71: '🌨️',
      73: '❄️',
      75: '❄️⛄',
      77: '🌨️❄️',
      80: '🌦️💧',
      81: '🌧️💦',
      82: '🌧️💦🌀',
      85: '🌨️❄️',
      86: '❄️⛄',
      95: '⛈️',
      96: '⛈️⚡',
      99: '⛈️⚡🌀'
    };
    return emoticonos[codigoClima] || '🌈';
  }

  obtenerEmoticonViento(velocidad: number): string {
    if (velocidad < 5) return '🍃';
    if (velocidad < 20) return '💨';
    if (velocidad < 40) return '💨💨';
    return '🌪️';
  }
}