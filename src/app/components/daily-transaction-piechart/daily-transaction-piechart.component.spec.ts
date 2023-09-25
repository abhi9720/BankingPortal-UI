import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTransactionPiechartComponent } from './daily-transaction-piechart.component';

describe('DailyTransactionPiechartComponent', () => {
  let component: DailyTransactionPiechartComponent;
  let fixture: ComponentFixture<DailyTransactionPiechartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyTransactionPiechartComponent]
    });
    fixture = TestBed.createComponent(DailyTransactionPiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
