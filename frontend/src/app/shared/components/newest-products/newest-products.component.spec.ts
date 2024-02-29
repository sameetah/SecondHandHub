import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewestProductsComponent } from './newest-products.component';

describe('NewestProductsComponent', () => {
  let component: NewestProductsComponent;
  let fixture: ComponentFixture<NewestProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewestProductsComponent]
    });
    fixture = TestBed.createComponent(NewestProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
