import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfSchedule } from './prof-schedule';

describe('ProfSchedule', () => {
  let component: ProfSchedule;
  let fixture: ComponentFixture<ProfSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
