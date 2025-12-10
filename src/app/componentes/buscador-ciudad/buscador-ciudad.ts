import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscador-ciudad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscador-ciudad.html',
  styleUrls: ['./buscador-ciudad.css']
})
export class BuscadorCiudadComponent {
  ciudad: string = '';
  @Output() ciudadSeleccionada = new EventEmitter<string>();

  buscar() {
    this.ciudadSeleccionada.emit(this.ciudad);
  }
}