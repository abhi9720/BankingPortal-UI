import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionLinechartComponent } from './transaction-linechart.component';

describe('TransactionLinechartComponent', () => {
  let component: TransactionLinechartComponent;
  let fixture: ComponentFixture<TransactionLinechartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionLinechartComponent]
    });
    fixture = TestBed.createComponent(TransactionLinechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
