import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetHelpComponent } from './get-help.component';

describe('GetHelpComponent', () => {
  let component: GetHelpComponent;
  let fixture: ComponentFixture<GetHelpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetHelpComponent]
    });
    fixture = TestBed.createComponent(GetHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
