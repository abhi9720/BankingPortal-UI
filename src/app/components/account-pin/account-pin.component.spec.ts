import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPinComponent } from './account-pin.component';

describe('AccountPinComponent', () => {
  let component: AccountPinComponent;
  let fixture: ComponentFixture<AccountPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountPinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
