import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-brands-slider',
  templateUrl: './brands-slider.component.html',
  styleUrls: ['./brands-slider.component.scss']
})
export class BrandsSliderComponent {
 
  @ViewChild('recipeCarousel') recipeCarousel!: ElementRef;

  ngAfterViewInit(): void {
    this.setupCarousel();
    console.log(this.recipeCarousel)
  }

  private setupCarousel(): void {
    const items = this.recipeCarousel.nativeElement.querySelectorAll('.carousel-item');
    const minPerSlide = 5;
    
    items.forEach((el: HTMLElement) => {
      let next = el.nextElementSibling as HTMLElement;
      for (let i = 1; i < minPerSlide; i++) {
        if (!next) {
          next = items[0] as HTMLElement;
        }
        const cloneChild = next.cloneNode(true) as HTMLElement;
        el.appendChild(cloneChild.children[0]);
        next = next.nextElementSibling as HTMLElement;
      }
    });
  }
}
