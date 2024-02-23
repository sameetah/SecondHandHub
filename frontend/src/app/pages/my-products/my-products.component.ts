import { Component } from '@angular/core';
import { AxiosService } from '../../shared/services/axios.service';
import { Product } from '../../shared/models/product';
import { User } from 'src/app/shared/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss'],
})
export class MyProductsComponent {
  products: Product[] = [];
  allProducts: Product[] = []; 
  loggedInUser: User | null = null;
  categories: string[] = [];
  constructor(private axiosService: AxiosService, private router: Router) {}

  ngOnInit(): void {
    this.axiosService.getLoggedInUserOb().subscribe((user) => {
      this.loggedInUser = user;
      this.axiosService
        .request('GET', '/products', {}, { userId: this.loggedInUser!.id })
        .then((response) => {
          this.products = response.data;
          this.allProducts= response.data;
          this.setCategories();
        });
    });

  
  }

  deleteProduct(id: number) {
    this.axiosService
      .request('DELETE', '/products/' + id, {})
      .then((response) => {
        console.log(response.data);
        this.products = this.products.filter((product) => product.id !== id);
      });
  }

  navigateToProduct(product: any) {
    this.router.navigate(['/product/' + product.id]);
  }


  setCategories(){
    this.products.forEach((product) => {
      if(!this.categories.includes(product.category)){
        this.categories.push(product.category);
      }
    });
    console.log(this.categories)
    }

    filterProductsByCategory(filterCategory: string) {
      if (filterCategory === 'all') {
        this.products = [...this.allProducts]; // Reset to all products
      } else {
        this.products = this.allProducts.filter((product) => product.category === filterCategory);
      }
    }

    filterProductsByPrice(filterPrice: number) {
      if (filterPrice === 0) {
        this.products = [...this.allProducts]; // Reset to all products
      } else {
        this.products = this.allProducts.filter((product) => product.price <= filterPrice);
      console.log(this.products)
      }
    }

    filterBySearchInput(searchInput: string){
      if (searchInput === '') {
        this.products = [...this.allProducts]; // Reset to all products
      } else {
        searchInput = searchInput.toLowerCase(); // Convert search input to lowercase
        this.products = this.allProducts.filter((product) => 
          product.title.toLowerCase().includes(searchInput) || 
          product.description.toLowerCase().includes(searchInput)
        );
      }
    }
    
}
