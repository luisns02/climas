import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../servicios/usuario';

@Component({
  selector: 'app-clima-horas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clima-horas.html',
  styleUrls: ['./clima-horas.css']
})
export class ClimaHorasComponent {
  @Input() datos: any;
  
  constructor(public usuarioService: UsuarioService) {}
  
  obtenerHora(fechaHora: string): string {
    return new Date(fechaHora).getHours().toString().padStart(2, '0') + ':00';
  }
}