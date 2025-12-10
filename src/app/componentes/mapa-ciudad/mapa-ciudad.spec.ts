import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaCiudad } from './mapa-ciudad';

describe('MapaCiudad', () => {
  let component: MapaCiudad;
  let fixture: ComponentFixture<MapaCiudad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaCiudad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaCiudad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
