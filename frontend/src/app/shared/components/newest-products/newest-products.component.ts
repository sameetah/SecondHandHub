import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { Category, Product } from '../../models/product';
import { User } from '../../models/user';
import { AxiosService } from '../../services/axios.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-newest-products',
  templateUrl: './newest-products.component.html',
  styleUrls: ['./newest-products.component.scss'],
})
export class NewestProductsComponent {
  @Input() endpointAll: string = '';
  @Input() endpoint: string = '';
  @Input() title: string = '';
  @Input() uniqueId: string = '';
  @Input() defaultPage: number = 0;
  @Input() defaultSize: number = 10;
  @Input() defaultSort: string = 'createdAt';
  @Input() defaultDirection: string = 'DESC';

  products: Product[] = [];
  catchedProducts: Product[] = [];
  loggedInUser: User | null = null;
  categories: Category[] = [];

  constructor(
    private axiosService: AxiosService,
    private router: Router,
    private categoryService: CategoryService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data.map((category) => ({
        ...category,
        expanded: false,
      }));
    });
    this.receiveProductsByCategory('All');
  }

  ngAfterViewInit() {
    const navElement = this.el.nativeElement.querySelector('.nav');
    let startX:any, scrollLeft:any;
    let isDragging = false;
    let scrollAmount = 0;
    const scrollStep = 0.2; // Smaller step for smoother scroll
  
    // Wheel event for mouse devices
    navElement.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      navElement.scrollLeft += e.deltaY;
      scrollAmount = navElement.scrollLeft; // Update the position for auto-scroll
    });
  
    // Touch events for touch devices
    navElement.addEventListener('touchstart', (e: TouchEvent) => {
      isDragging = true;
      startX = e.touches[0].pageX - navElement.offsetLeft;
      scrollLeft = navElement.scrollLeft;
    });
  
    navElement.addEventListener('touchmove', (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.touches[0].pageX - navElement.offsetLeft;
      const walk = (x - startX); // Scroll-fastness
      navElement.scrollLeft = scrollLeft - walk;
    });
  
    navElement.addEventListener('touchend', () => {
      isDragging = false;
      scrollAmount = navElement.scrollLeft; // Update scrollAmount to the current position
    });
  
    // Automatic scrolling
    const scrollUpdate = () => {
      if (!isDragging) { // Only auto-scroll if not currently dragging
        scrollAmount += scrollStep;
        navElement.scrollLeft = scrollAmount;
      }
      requestAnimationFrame(scrollUpdate);
    };
  
    // Start automatic scrolling
    requestAnimationFrame(scrollUpdate);
  }
  
  
  
  
  receiveProductsByCategory(category: string) {
    this.axiosService.getLoggedInUserOb().subscribe((user) => {
      this.loggedInUser = user;
      this.products = [];

      if (category === 'All') {
        this.axiosService
          .request('GET', this.endpointAll, {}, {})
          .then((response) => {
            this.products = response.data;
          });
      } else {
        let allProducts: Product[] = [];

        const fetchAndCollectProducts = (catName: string) => {
          return this.fetchProductsByCategoryName(catName)
            .then((products) => {
              allProducts.push(...products);
            });
        };

        let promises = [fetchAndCollectProducts(category)];

        let mainCategory = this.categories.find(c => c.name === category);

        if (mainCategory) {
          mainCategory.subCategories.forEach(subCat => {
            promises.push(fetchAndCollectProducts(subCat.name));

            subCat.subSubCategories.forEach(subSubCat => {
              promises.push(fetchAndCollectProducts(subSubCat.name));
            });
          });
        }

        Promise.all(promises).then(() => {
          if (this.title ==="Newest Products"){ allProducts.sort((a, b) => {          
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });}
          else {
            allProducts.sort((a, b) => {          
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
          }
         

          this.products = allProducts.slice(0, 10);
          console.log("🚀 ~ file: newest-products.component.ts:91 ~ NewestProductsComponent ~ Promise.all ~ this.products:", this.products)
          
        });
      }
    });
}

fetchProductsByCategoryName(catName: string) {
    return this.axiosService  
        .request('GET', this.endpoint, {}, {
          category: catName,
          page: this.defaultPage,
          size: this.defaultSize,
          sort: this.defaultSort,
          direction: this.defaultDirection,
        })
        .then((response) => {
          return response.data;  
        });
}


  navigateToProduct(product: any) {
    this.router.navigate(['/product/' + product.id]);
  }
}
