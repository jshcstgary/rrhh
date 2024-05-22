import { TestBed } from '@angular/core/testing';

import { TipoRutaService } from './tipo-ruta.service';

describe('TipoRutaService', () => {
  let service: TipoRutaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoRutaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
