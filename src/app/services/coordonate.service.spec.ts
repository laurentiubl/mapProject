import { TestBed } from '@angular/core/testing';

import { CoordonateService } from './coordonate.service';

describe('CoordonateService', () => {
  let service: CoordonateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoordonateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
