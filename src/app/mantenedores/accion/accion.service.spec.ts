import { TestBed } from '@angular/core/testing';

import { AccionService } from './accion.service';

describe('AccionService', () => {
  let service: AccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
