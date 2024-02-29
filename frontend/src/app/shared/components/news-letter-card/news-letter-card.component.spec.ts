import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsLetterCardComponent } from './news-letter-card.component';

describe('NewsLetterCardComponent', () => {
  let component: NewsLetterCardComponent;
  let fixture: ComponentFixture<NewsLetterCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsLetterCardComponent]
    });
    fixture = TestBed.createComponent(NewsLetterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
