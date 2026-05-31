import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCitas } from './ver-citas';

describe('VerCitas', () => {
  let component: VerCitas;
  let fixture: ComponentFixture<VerCitas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerCitas],
    }).compileComponents();

    fixture = TestBed.createComponent(VerCitas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
