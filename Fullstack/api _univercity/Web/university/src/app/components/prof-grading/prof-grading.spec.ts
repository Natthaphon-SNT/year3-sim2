import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfGrading } from './prof-grading';

describe('ProfGrading', () => {
  let component: ProfGrading;
  let fixture: ComponentFixture<ProfGrading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfGrading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfGrading);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
