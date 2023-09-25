import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyTransactionChartComponent } from './monthly-transaction-chart.component';

describe('MonthlyTransactionChartComponent', () => {
  let component: MonthlyTransactionChartComponent;
  let fixture: ComponentFixture<MonthlyTransactionChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlyTransactionChartComponent]
    });
    fixture = TestBed.createComponent(MonthlyTransactionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
