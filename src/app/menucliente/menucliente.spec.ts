import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menucliente } from './menucliente';

describe('Menucliente', () => {
  let component: Menucliente;
  let fixture: ComponentFixture<Menucliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menucliente],
    }).compileComponents();

    fixture = TestBed.createComponent(Menucliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
