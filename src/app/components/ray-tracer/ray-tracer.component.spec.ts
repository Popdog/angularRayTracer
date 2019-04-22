import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RayTracerComponent } from './ray-tracer.component';

describe('RayTracerComponent', () => {
  let component: RayTracerComponent;
  let fixture: ComponentFixture<RayTracerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RayTracerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RayTracerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
