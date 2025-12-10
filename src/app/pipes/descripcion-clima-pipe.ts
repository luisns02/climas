import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descripcionClima',
  standalone: true
})
export class DescripcionClimaPipe implements PipeTransform {

  transform(codigo: number): string {
    const descripciones: any = {
      0: 'Cielo despejado',
      1: 'Mayormente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Niebla',
      48: 'Niebla con escarcha',
      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna intensa',
      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia fuerte',
      71: 'Nevada ligera',
      73: 'Nevada moderada',
      75: 'Nevada intensa',
      95: 'Tormenta eléctrica'
    };

    return descripciones[codigo] || 'Clima desconocido';
  }
}
