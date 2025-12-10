// componentes/cambiar-usuario/cambiar-usuario.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../servicios/usuario';

@Component({
  selector: 'app-cambiar-usuario',
  templateUrl: './cambiar-usuario.html',
  styleUrls: ['./cambiar-usuario.css'],
  imports: [CommonModule, FormsModule]
})
export class CambiarUsuarioComponent implements OnInit {
  @Output() usuarioCambiado = new EventEmitter<string>();
  @Output() cerrarSesion = new EventEmitter<void>();
  
  usuarios: string[] = [];
  nuevoUsuario: string = '';
  usuarioActivo: string = '';
  mostrarFormularioNuevo: boolean = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.usuarioActivo = this.usuarioService.getNombreUsuario();
  }

  cargarUsuarios() {
    this.usuarios = this.usuarioService.getUsuarios();
  }

  seleccionarUsuario(usuario: string) {
    this.usuarioService.cambiarUsuario(usuario);
    this.usuarioActivo = usuario;
    this.usuarioCambiado.emit(usuario);
  }

  agregarUsuario() {
    if (this.nuevoUsuario.trim()) {
      this.usuarioService.setNombreUsuario(this.nuevoUsuario.trim());
      this.cargarUsuarios();
      this.usuarioActivo = this.nuevoUsuario.trim();
      this.nuevoUsuario = '';
      this.mostrarFormularioNuevo = false;
      this.usuarioCambiado.emit(this.usuarioActivo);
    }
  }

  eliminarUsuario(usuario: string, event: Event) {
    event.stopPropagation(); // Evita que se seleccione al eliminar
    if (confirm(`¿Eliminar a ${usuario}?`)) {
      this.usuarioService.eliminarUsuario(usuario);
      this.cargarUsuarios();
      
      // Si eliminamos al usuario activo, emitimos cerrar sesión
      if (usuario === this.usuarioActivo) {
        this.cerrarSesion.emit();
      }
    }
  }

  cerrarSesionUsuario() {
    this.usuarioService.limpiarUsuario();
    this.usuarioActivo = '';
    this.cerrarSesion.emit();
  }
}