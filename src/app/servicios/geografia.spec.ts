import { TestBed } from '@angular/core/testing';

import { Geografia } from './geografia';

describe('Geografia', () => {
  let service: Geografia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Geografia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
