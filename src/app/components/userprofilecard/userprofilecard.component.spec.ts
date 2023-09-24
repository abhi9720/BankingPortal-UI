import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserprofilecardComponent } from './userprofilecard.component';

describe('UserprofilecardComponent', () => {
  let component: UserprofilecardComponent;
  let fixture: ComponentFixture<UserprofilecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserprofilecardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserprofilecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
