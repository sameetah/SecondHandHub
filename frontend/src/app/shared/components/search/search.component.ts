import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SearchProductService } from '../../services/search-product.service';
import { Category, CustomProduct, Product } from '../../models/product';
import { AxiosService } from '../../services/axios.service';
import { ProductLocationService } from '../../services/product-location.service';
import { CategoryService } from '../../services/category.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductsService } from '../../services/products.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  products: Product[] = [];
  locations: string[] = [];
  selectedLocation: string | null = null;
  categories: Category[] = [];
  selectedCategory: string | null = null;

  query: any;

  minPrice: number | null = null;
  maxPrice: number | null = null;
  searchProductsResult: Product[] = [];

  searchForProducts: FormGroup;
  formDataResult: string = '';

  constructor(
    private activeRoute: ActivatedRoute,
    private axiosService: AxiosService,
    private router: Router,
    private productLocationService: ProductLocationService,
    private productCateforyService: CategoryService,
    private http: HttpClient,
    private productService: ProductsService,
    private fb: FormBuilder
  ) {
    this.searchForProducts = this.fb.group({
      keyword: [''],
      categoryInput: [''],
      locationInput: [''],
      minPriceInput: [''],
      maxPriceInput: [''],
    });
  }

  ngOnInit(): void {
    this.query = this.activeRoute.snapshot.paramMap.get('query');

    this.productService
      .getProductsByKeyword(this.query)
      .subscribe((productsResponse) => {
        this.products = productsResponse;
      });

    this.productLocationService.getLocations().subscribe((data: string[]) => {
      this.locations = data;
    });

    this.productCateforyService
      .getCategories()
      .subscribe((data: Category[]) => {
        this.categories = data;
        this.getCategoryNames();
      });

    this.productCateforyService
      .getCategories()
      .subscribe((data: Category[]) => {
        this.categories = data;
      });

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const url = val.url;
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];
        this.searchForProducts.controls['keyword'].setValue(lastPart);
      }
    });
    this.searchForProducts.controls['keyword'].valueChanges.subscribe(
      (test) => {
        this.onSubmit('onKeywordChanges');
      }
    );
  }

  getCategoryNames(): void {
    this.categories.forEach((category) => {});
  }

  navigateToProduct(product: any) {
    this.router.navigate(['/product/' + product.id]);
  }

  onSubmit(onKeywordChanges?: string) {
    const formData = this.searchForProducts.value;
    const paramsString = '';
    const searchParams = new URLSearchParams(paramsString);
    for (const p of searchParams) {
    }
    let keywordString = '';
    if (onKeywordChanges) {
      keywordString = `keyword=${this.searchForProducts.controls['keyword'].value}`;
    } else {
      if (formData.keyword !== '') {
        searchParams.append('keyword', formData.keyword);
      }
    }
    if (formData.categoryInput && formData.categoryInput !== 'All') {
      searchParams.append('category', formData.categoryInput);
    } else {
      searchParams.delete('category');
    }
    if (formData.locationInput && formData.locationInput !== 'All') {
      searchParams.append('location', formData.locationInput);
    } else {
      searchParams.delete('location');
    }
    if (formData.minPriceInput !== '' && formData.minPriceInput !== null) {
      searchParams.append('minPrice', formData.minPriceInput);
    }
    if (formData.maxPriceInput !== '' && formData.maxPriceInput !== null) {
      searchParams.append('maxPrice', formData.maxPriceInput);
    }
    if (this.formDataResult.endsWith('&')) {
      this.formDataResult = this.formDataResult.slice(0, -1);
    }

    let searchParamsValues = searchParams.toString();

    if (keywordString) {
      searchParamsValues = keywordString + searchParamsValues;
    }

    this.productService
      .getProductsByUserInut(searchParamsValues)
      .subscribe((productsResponse) => {
        this.products = productsResponse;
      });
  }
}
