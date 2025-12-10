import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescripcionClimaPipe } from '../../pipes/descripcion-clima-pipe'; 
import { UsuarioService } from '../../servicios/usuario'; 

@Component({
  selector: 'app-detalle-clima',
  standalone: true,
  imports: [CommonModule, DescripcionClimaPipe],
  templateUrl: './detalle-clima.html',
  styleUrls: ['./detalle-clima.css']
})
export class DetalleClimaComponent { 
  @Input() climaActual: any;
  
  constructor(public usuarioService: UsuarioService) {}
}