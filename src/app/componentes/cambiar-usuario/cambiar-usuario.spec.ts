import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarUsuario } from './cambiar-usuario';

describe('CambiarUsuario', () => {
  let component: CambiarUsuario;
  let fixture: ComponentFixture<CambiarUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambiarUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
