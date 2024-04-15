import { TestBed } from '@angular/core/testing';

import { ConsultaSolicitudesService } from './consulta-solicitudes.service';

describe('ConsultaSolicitudesService', () => {
  let service: ConsultaSolicitudesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaSolicitudesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
