import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menuadmin } from './menuadmin';

describe('Menuadmin', () => {
  let component: Menuadmin;
  let fixture: ComponentFixture<Menuadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menuadmin],
    }).compileComponents();

    fixture = TestBed.createComponent(Menuadmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
