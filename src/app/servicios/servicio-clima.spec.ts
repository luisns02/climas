import { TestBed } from '@angular/core/testing';

import { ServicioClima } from './servicio-clima';

describe('ServicioClima', () => {
  let service: ServicioClima;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioClima);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
