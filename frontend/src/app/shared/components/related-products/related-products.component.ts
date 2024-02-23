import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
} from '@angular/core';
import { Category, Product } from '../../models/product';
import { CategoryService } from '../../services/category.service';
import { NgZone } from '@angular/core';
import { AxiosService } from '../../services/axios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.component.html',
  styleUrls: ['./related-products.component.scss']
})
export class RelatedProductsComponent {
  @ViewChild('recipeCarousel') recipeCarousel!: ElementRef;
  categories: Category[] = [];
  @ViewChildren('carouselItem') carouselItems!: QueryList<any>;
  products: Product[] = [];
  responsiveOptions: any[] | undefined;

  constructor(
    private axiosService: AxiosService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.axiosService.getLoggedInUserOb().subscribe((user) => {
      this.axiosService
        .request('GET', "/products", {}, {})
        .then((response) => {
          this.products = response.data;
        });
    });
    this.responsiveOptions = [
      {
        breakpoint: '3000px',
        numVisible: 5,
        numScroll: 1,
      },
      {
        breakpoint: '1309px',
        numVisible: 4,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '500px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

 

  

  
  navigateToProduct(product: any) {
    this.router.navigate(['/product/' + product.id]);
  }
}
