import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobadoresFijosComponent } from './aprobadores-fijos.component';

describe('AprobadoresFijosComponent', () => {
  let component: AprobadoresFijosComponent;
  let fixture: ComponentFixture<AprobadoresFijosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AprobadoresFijosComponent]
    });
    fixture = TestBed.createComponent(AprobadoresFijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
