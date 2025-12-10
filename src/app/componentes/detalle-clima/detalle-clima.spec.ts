import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleClima } from './detalle-clima';

describe('DetalleClima', () => {
  let component: DetalleClima;
  let fixture: ComponentFixture<DetalleClima>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleClima]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleClima);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
