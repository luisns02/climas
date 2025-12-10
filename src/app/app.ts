import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { BienvenidaComponent } from './componentes/bienvenida/bienvenida';
import { BuscadorCiudadComponent } from './componentes/buscador-ciudad/buscador-ciudad';
import { MapaCiudadComponent } from './componentes/mapa-ciudad/mapa-ciudad';
import { ClimaSemanalComponent } from './componentes/clima-semanal/clima-semanal';
import { DetalleClimaComponent } from './componentes/detalle-clima/detalle-clima';
import { TurismoComponent } from './componentes/turismo/turismo';
import { ClimaHorasComponent } from './componentes/clima-horas/clima-horas';
import { CambiarUsuarioComponent } from './componentes/cambiar-usuario/cambiar-usuario';
import { FotoGeograficaComponent } from './componentes/foto-geografica/foto-geografica';

import { ServicioClima } from './servicios/servicio-clima';
import { UsuarioService } from './servicios/usuario';
import { ImagenesService } from './servicios/imagenes'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    BienvenidaComponent,
    BuscadorCiudadComponent,
    MapaCiudadComponent,
    ClimaSemanalComponent,
    DetalleClimaComponent,
    TurismoComponent,
    ClimaHorasComponent,
    CambiarUsuarioComponent,
    FotoGeograficaComponent,
  ],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  pantallaActual: 'bienvenida' | 'principal' | 'horas' | 'semanal' | 'turismo' | 'cambiar-usuario' = 'bienvenida';
  nombreUsuario: string = '';
  lat!: number;
  lon!: number;
  climaSemanal: any;
  climaActual: any;
  turismo: any[] = [];
  climaPorHoras: any;
  recomendacionVestimenta: string = '';
  ciudadActual: string = '';
  mostrarBienvenida: boolean = true;

  constructor(
    public api: ServicioClima,
    public usuarioService: UsuarioService,
    private imagenesService: ImagenesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.verificarUsuario();
    
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.verificarUsuario();
    });
  }

  verificarUsuario() {
    const nombre = this.usuarioService.getNombreUsuario();
    if (nombre) {
      this.nombreUsuario = nombre;
      this.pantallaActual = 'principal';
      this.mostrarBienvenida = false;
    } else {
      this.mostrarBienvenida = true;
      this.pantallaActual = 'bienvenida';
    }
  }

  onNombreGuardado(nombre: string) {
    this.nombreUsuario = nombre;
    this.usuarioService.setNombreUsuario(nombre);
    this.pantallaActual = 'principal';
    this.mostrarBienvenida = false;
  }

  onUsuarioCambiado(nuevoUsuario: string) {
    this.nombreUsuario = nuevoUsuario;
    this.pantallaActual = 'principal';
    this.mostrarBienvenida = false;
  }

  onCerrarSesion() {
    this.cerrarSesion();
  }

  procesarCiudad(ciudad: string) {
    if (!ciudad) return;
    
    console.log('🔍 ========== INICIO PROCESAR CIUDAD ==========');
    console.log('🏙️ Ciudad buscada:', ciudad);
    
    this.ciudadActual = ciudad;
    this.turismo = []; // Limpiar turismo anterior

    this.api.buscarCiudad(ciudad).subscribe((resp: any) => {
      console.log('📍 Respuesta buscarCiudad:', resp);
      
      if (!resp || resp.length === 0) {
        console.warn('⚠️ NO se encontró la ciudad:', ciudad);
        return;
      }

      this.lat = parseFloat(resp[0].lat);
      this.lon = parseFloat(resp[0].lon);
      console.log('🎯 Coordenadas obtenidas:', this.lat, this.lon);

      // 1. OBTENER PUNTOS TURÍSTICOS (IMPORTANTE)
      console.log('🏛️ Solicitando puntos turísticos...');
      this.api.obtenerTurismo(this.lat, this.lon).subscribe({
        next: (tur: any) => {
          console.log('✅ === RESPUESTA TURISMO COMPLETA ===');
          console.log('📦 Respuesta cruda:', tur);
          console.log('❓ ¿Tiene propiedad "elements"?', tur?.elements ? 'SÍ' : 'NO');
          console.log('🔢 Número de elementos:', tur?.elements?.length || 0);
          
          if (tur && tur.elements && tur.elements.length > 0) {
            console.log('🎉 ¡Se encontraron lugares turísticos!');
            console.log('📋 Primer elemento:', tur.elements[0]);
            console.log('🏷️ Tags del primer elemento:', tur.elements[0].tags);
            
            // Procesar cada lugar y añadir imagen
            this.turismo = tur.elements.map((lugar: any, index: number) => {
              const nombre = lugar.tags?.name || 'Lugar turístico';
              const tipo = lugar.tags?.tourism || 'attraction';
              const imagenUrl = this.imagenesService.obtenerImagenParaLugar(nombre, tipo, index);
              
              console.log(`🏞️ Lugar ${index + 1}:`, {
                nombre: nombre,
                tipo: tipo,
                tieneImagen: !!imagenUrl,
                imagenUrl: imagenUrl?.substring(0, 50) + '...',
                tagsCompletos: lugar.tags
              });
              
              return {
                ...lugar,
                imagenUrl: imagenUrl
              };
            });
            
            console.log('📊 Array turismo FINAL:', this.turismo);
            console.log('🎯 Longitud del array turismo:', this.turismo.length);
            
            // Forzar detección de cambios (solución temporal)
            setTimeout(() => {
              console.log('🔄 Forzando actualización de vista...');
              this.turismo = [...this.turismo];
            }, 100);
            
          } else {
            console.warn('😞 NO hay elementos turísticos para mostrar');
            console.warn('Posibles causas:');
            console.warn('1. La API no devolvió datos');
            console.warn('2. No hay lugares turísticos en esa área');
            console.warn('3. La estructura de respuesta es diferente');
            this.turismo = [];
          }
        },
        error: (error: any) => {
          console.error('❌ ERROR en obtenerTurismo:');
          console.error('Mensaje:', error.message);
          console.error('Error completo:', error);
          console.error('Status:', error.status);
          console.error('URL (si está disponible):', error.url);
          this.turismo = [];
        }
      });

      // 2. OBTENER CLIMA POR HORAS
      console.log('⏰ Solicitando clima por horas...');
      this.api.obtenerClimaPorHoras(this.lat, this.lon).subscribe({
        next: (horas: any) => {
          console.log('✅ Clima por horas obtenido');
          this.climaPorHoras = horas;
        },
        error: (error: any) => {
          console.error('❌ Error clima por horas:', error);
        }
      });
      
      // 3. OBTENER CLIMA SEMANAL
      console.log('📅 Solicitando clima semanal...');
      this.api.obtenerClima(this.lat, this.lon).subscribe({
        next: (meteo: any) => {
          console.log('✅ Clima semanal obtenido');
          this.climaSemanal = meteo;
          this.climaActual = meteo.current_weather;
          
          // Generar recomendación de vestimenta
          this.recomendacionVestimenta = this.usuarioService.obtenerRecomendacionClima(
            meteo.current_weather.weathercode,
            meteo.current_weather.temperature
          );
          console.log('👕 Recomendación:', this.recomendacionVestimenta);
        },
        error: (error: any) => {
          console.error('❌ Error clima semanal:', error);
        }
      });

      console.log('🎉 ========== FIN PROCESAR CIUDAD ==========');

    }, (error: any) => {
      console.error('❌ ERROR en buscarCiudad:', error);
    });
  }

  cambiarPantalla(pantalla: 'principal' | 'horas' | 'semanal' | 'turismo' | 'cambiar-usuario') {
    console.log('🔄 Cambiando pantalla a:', pantalla);
    console.log('🏛️ Turismo actual (antes):', this.turismo?.length || 0, 'elementos');
    this.pantallaActual = pantalla;
    
    // Forzar actualización cuando se cambia a turismo
    if (pantalla === 'turismo') {
      setTimeout(() => {
        console.log('🔄 Refrescando vista de turismo...');
        this.turismo = [...this.turismo];
      }, 50);
    }
  }

  volverPrincipal() {
    this.pantallaActual = 'principal';
  }

  cerrarSesion() {
    this.usuarioService.limpiarUsuario();
    this.nombreUsuario = '';
    this.mostrarBienvenida = true;
    this.pantallaActual = 'bienvenida';
    this.router.navigate(['/']);
  }
}