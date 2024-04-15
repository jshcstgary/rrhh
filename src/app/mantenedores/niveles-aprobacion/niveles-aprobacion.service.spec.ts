import { TestBed } from "@angular/core/testing";

import { NivelesAprobacionService } from "./niveles-aprobacion.service";

describe("TipoRutaService", () => {
  let service: NivelesAprobacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NivelesAprobacionService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
