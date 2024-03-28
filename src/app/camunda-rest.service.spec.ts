import { TestBed } from '@angular/core/testing';

import { CamundaRestService } from './camunda-rest.service';

describe('CamundaRestService', () => {
  let service: CamundaRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CamundaRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
