import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menumedico } from './menumedico';

describe('Menumedico', () => {
  let component: Menumedico;
  let fixture: ComponentFixture<Menumedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menumedico],
    }).compileComponents();

    fixture = TestBed.createComponent(Menumedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
