import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinCreationModelComponent } from './pin-creation-model.component';

describe('PinCreationModelComponent', () => {
  let component: PinCreationModelComponent;
  let fixture: ComponentFixture<PinCreationModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PinCreationModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinCreationModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
