import { TestBed } from "@angular/core/testing";

import { SolicitudesService } from "./solicitudes.service";

describe("RegistrarSolicitudService", () => {
  let service: SolicitudesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
