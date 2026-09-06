import { TestBed } from '@angular/core/testing';

import { Menage } from './menage';

describe('Menage', () => {
  let service: Menage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Menage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
