import { ViewChild,Component, ElementRef, OnInit, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @ViewChild('stars', { static: false }) starContainerRef: ElementRef| null = null;
  products: any[] = [
    { name: 'Product 1', price: '$99.99', image: 'product1.png' },
    { name: 'Product 1', price: '$99.99', image: 'product1.png' },
    { name: 'Product 1', price: '$99.99', image: 'product1.png' },
    { name: 'Product 1', price: '$99.99', image: 'product1.png' },
    { name: 'Product 1', price: '$99.99', image: 'product1.png' },
    { name: 'Product 1', price: '$99.99', image: 'product1.png' },
    { name: 'Product 1', price: '$99.99', image: 'product1.png' },
    { name: 'Product 1', price: '$99.99', image: 'product1.png' },
    { name: 'Product 1', price: '$99.99', image: 'product1.png' },
    { name: 'Product 5', price: '$99.99', image: 'product1.png' },
  ];
  slides: any[] = new Array(3).fill({id: -1, src: '', subtitle: ''});

  constructor(private renderer: Renderer2, private el: ElementRef) { }
  ngAfterViewInit(): void {
    const starContainer = this.starContainerRef!.nativeElement;
    if (starContainer) {
      console.log("Star container found."); 
    } else {
      console.log("Star container not found!"); 
    }
  
    const numberOfStars = 200; 
    console.log(`Creating ${numberOfStars} stars...`); 
  

    for (let i = 0; i < numberOfStars; i++) {      
      const star = this.renderer.createElement('div');
      this.renderer.addClass(star, 'star');
      this.renderer.setStyle(star, 'left', `${Math.random() * 100}vw`);
      this.renderer.setStyle(star, 'top', `${Math.random() * 100}vh`);
      this.renderer.appendChild(starContainer, star);
      console.log(`Star ${i + 1} created at ${star.style.left}, ${star.style.top}`); 
    }
  

    const speed = 0.5; 
    console.log(`Setting falling speed to ${speed}.`); 
  
    function animateStars() {
      const stars = document.querySelectorAll('.star');
      console.log(`Animating ${stars.length} stars.`);  
      
      stars.forEach((star: any, index: number) => {
        let top = parseFloat(window.getComputedStyle(star).top.replace('px', ''));
        console.log(`Star ${index + 1} initial top position: ${top}`); 
        top += speed;
  
        if (top > window.innerHeight) {
          console.log(`Star ${index + 1} reached bottom. Resetting.`); 
          top = 0;
          star.style.left = `${Math.random() * 100}vw`;
        }
  
        star.style.top = `${top}px`;
        console.log(`Star ${index + 1} moved to top position: ${top}`);
      });
  
      requestAnimationFrame(animateStars);
    }

    console.log('Starting animation...');
    animateStars();
  }
  
  
  ngOnInit(): void {
    this.slides[0] = {
      id: 0,
      src: 'assets/images/banner1.png',
      subtitle: 'Find what you have been searching for'
    };
    this.slides[1] = {
      id: 1,
      src: 'assets/images/banner2.png',
      subtitle: 'Find your new Smartphone'
    }
    this.slides[2] = {
      id: 2,
      src: 'assets/images/banner3.png',
      subtitle: 'Make everyone Happy, and save some Bucks!'
    }
  }
}