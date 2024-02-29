import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsSliderComponent } from './brands-slider.component';

describe('BrandsSliderComponent', () => {
  let component: BrandsSliderComponent;
  let fixture: ComponentFixture<BrandsSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrandsSliderComponent]
    });
    fixture = TestBed.createComponent(BrandsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
