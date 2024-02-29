import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReducedCardsComponent } from './reduced-cards.component';

describe('ReducedCardsComponent', () => {
  let component: ReducedCardsComponent;
  let fixture: ComponentFixture<ReducedCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReducedCardsComponent]
    });
    fixture = TestBed.createComponent(ReducedCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
