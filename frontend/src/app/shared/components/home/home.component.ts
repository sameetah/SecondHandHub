import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AxiosService } from '../../services/axios.service';
import {
  Category,
  Product,
  SubCategory,
  SubSubCategory,
} from '../../models/product';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: false, showIndicators: true } }
 ],
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  slides = [
    {image: 'assets/images/nature/1.jpg', text: 'First'},
    {image: 'assets/images/nature/2.jpg',text: 'Second'},
    {image: 'assets/images/nature/3.jpg',text: 'Third'}
 ];
 noWrapSlides = false;
 showIndicator = true;
  product: any;
  categories: Category[] = [];
  showSelectedCategory = false;
  carouselItems = [
    {
      categories: '100% natural',
      title: 'Fresh Smoothie & Summer Juice',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim massa diam elementum.',
      buttonText: 'Shop Now',
      imageSrc: 'images/product-thumb-1.png',
      link: 'Automotive'
    },
    {
      categories: '100% natural',
      title: 'Fresh Smoothie & Summer Juice',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim massa diam elementum.',
      buttonText: 'Shop Collection',
      imageSrc: 'images/product-thumb-1.png',
      link: 'Food & Ba'

    },
    {
      categories: '100% natural',
      title: 'Heinz Tomato Ketchup',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim massa diam elementum.',
      buttonText: 'Shop Collection',
      imageSrc: 'images/product-thumb-2.png'
    }
  ];
products:Product[] =[]
  singleProduct1: Product[] = [];
  singleProduct2: Product[] = [];
  singleProduct3: Product[] = [];
  @ViewChild('headerCategories') headerCategories: ElementRef | null = null; // Reference to your <ul> element
  productsCategoryCars: Product[] = [];

  constructor(
    private axiosService: AxiosService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngAfterViewInit(): void {
    console.log('ElementRef: ', this.headerCategories); 
    this.initAutoScroll();
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data.map((category) => ({
        ...category,
        expanded: false,
      }));
    });
    this.axiosService
      .request('GET', '/products', {})
      .then((response) => (this.products = response.data))
      .catch((error) => {
        console.log(
          '🚀 ~ file: home.component.ts:36 ~ HomeComponent ~ ngOnInit ~ error.message:',
          error
        );
      });

  }

  navigateToProduct(product: any) {
    this.router.navigate(['/product/' + product.id]);
  }


  
  initAutoScroll() {
    let scrollAmount = 20;
    const container = this.headerCategories!.nativeElement;
    let speed = 1;

    const scrollContent = () => {
      container.scrollLeft = scrollAmount;

      // Change direction at edges
      if (
        scrollAmount >= container.scrollWidth - container.clientWidth ||
        scrollAmount <= 0
      ) {
        speed = -speed;
      }

      scrollAmount += speed;
    };

    setInterval(scrollContent, 20); // You can adjust the interval time
  }

  displaySubSubCategory(
    subSubCategory: SubSubCategory | SubCategory | Category
  ): void {
    this.categoryService.subCategorySelected(subSubCategory);
  }

  
}
