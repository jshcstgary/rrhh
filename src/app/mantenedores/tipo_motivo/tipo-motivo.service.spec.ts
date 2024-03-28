import { TestBed } from '@angular/core/testing';

import { TipoMotivoService } from './tipo-motivo.service';

describe('TipoMotivoService', () => {
  let service: TipoMotivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoMotivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
