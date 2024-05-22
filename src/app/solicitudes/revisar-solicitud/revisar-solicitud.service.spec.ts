import { TestBed } from '@angular/core/testing';

import { RevisarSolicitudService } from './revisar-solicitud.service';

describe('RevisarSolicitudService', () => {
  let service: RevisarSolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevisarSolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
