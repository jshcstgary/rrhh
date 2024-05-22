import { TestBed } from '@angular/core/testing';

import { TipoProcesoService } from './tipo-proceso.service';

describe('TipoProcesoService', () => {
  let service: TipoProcesoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoProcesoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
