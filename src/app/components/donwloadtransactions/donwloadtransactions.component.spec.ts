import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonwloadtransactionsComponent } from './donwloadtransactions.component';

describe('DonwloadtransactionsComponent', () => {
  let component: DonwloadtransactionsComponent;
  let fixture: ComponentFixture<DonwloadtransactionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonwloadtransactionsComponent]
    });
    fixture = TestBed.createComponent(DonwloadtransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
