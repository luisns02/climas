import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FotoGeografica } from './foto-geografica';

describe('FotoGeografica', () => {
  let component: FotoGeografica;
  let fixture: ComponentFixture<FotoGeografica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FotoGeografica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FotoGeografica);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
