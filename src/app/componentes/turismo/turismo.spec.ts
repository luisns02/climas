import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurismoComponent } from './turismo';

describe('Turismo', () => {
  let component: TurismoComponent;
  let fixture: ComponentFixture<TurismoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurismoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
