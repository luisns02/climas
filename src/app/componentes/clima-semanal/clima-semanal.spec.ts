import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimaSemanal } from './clima-semanal';

describe('ClimaSemanal', () => {
  let component: ClimaSemanal;
  let fixture: ComponentFixture<ClimaSemanal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClimaSemanal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClimaSemanal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
