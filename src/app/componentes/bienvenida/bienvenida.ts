import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.html',
  styleUrls: ['./bienvenida.css'],
  imports: [CommonModule, FormsModule]
})
export class BienvenidaComponent {
  @Output() nombreGuardado = new EventEmitter<string>();
  nombre: string = '';

  guardarNombre() {
    if (this.nombre && this.nombre.trim() !== '') {
      // Asegúrate de emitir solo el string, no el evento
      this.nombreGuardado.emit(this.nombre.trim());
    }
  }
}