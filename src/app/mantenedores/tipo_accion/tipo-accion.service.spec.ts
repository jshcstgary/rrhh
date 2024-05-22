import { TestBed } from '@angular/core/testing';

import { TipoAccionService } from './tipo-accion.service';

describe('TipoAccionService', () => {
  let service: TipoAccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoAccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
