import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescripcionClimaPipe } from '../../pipes/descripcion-clima-pipe';
import { UsuarioService } from '../../servicios/usuario';

@Component({
  selector: 'app-clima-semanal',
  standalone: true,
  imports: [CommonModule, DescripcionClimaPipe],
  templateUrl: './clima-semanal.html',
  styleUrls: ['./clima-semanal.css']
})
export class ClimaSemanalComponent {
  @Input() datos: any;

  constructor(public usuarioService: UsuarioService) {}

  obtenerDia(fecha: string): string {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const fechaObj = new Date(fecha);
    return dias[fechaObj.getDay()] + ' ' + fechaObj.getDate();
  }
}