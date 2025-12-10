import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorCiudad } from './buscador-ciudad';

describe('BuscadorCiudad', () => {
  let component: BuscadorCiudad;
  let fixture: ComponentFixture<BuscadorCiudad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorCiudad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscadorCiudad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
