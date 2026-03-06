import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLibraryComponent } from './admin-library';

describe('AdminLibraryComponent', () => {
  let component: AdminLibraryComponent;
  let fixture: ComponentFixture<AdminLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLibraryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
