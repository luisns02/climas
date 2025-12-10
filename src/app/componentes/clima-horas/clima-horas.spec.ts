import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimaHoras } from './clima-horas';

describe('ClimaHoras', () => {
  let component: ClimaHoras;
  let fixture: ComponentFixture<ClimaHoras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClimaHoras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClimaHoras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
