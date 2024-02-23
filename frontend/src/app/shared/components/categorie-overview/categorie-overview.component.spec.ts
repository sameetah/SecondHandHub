import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieOverviewComponent } from './categorie-overview.component';

describe('CategorieOverviewComponent', () => {
  let component: CategorieOverviewComponent;
  let fixture: ComponentFixture<CategorieOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorieOverviewComponent]
    });
    fixture = TestBed.createComponent(CategorieOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
