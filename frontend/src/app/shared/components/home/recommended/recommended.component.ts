import { Component, Input, OnInit } from '@angular/core';
import { AxiosService } from 'src/app/shared/services/axios.service';
import { User } from 'src/app/shared/models/user'
import { Router } from '@angular/router';
import { Category, Product } from 'src/app/shared/models/product';

@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.scss']
})
export class RecommendedComponent implements OnInit {

  loggedInUser: User | null = null;
  products: Product[] = [];
  categories: Category[] = [];
  @Input() endpointAll: string = '';
  @Input() endpoint: string = '';
  @Input() title: string = '';
  @Input() uniqueId: string = '';
  @Input() defaultPage: number = 0;
  @Input() defaultSize: number = 10;
  @Input() defaultSort: string = 'createdAt';
  @Input() defaultDirection: string = 'DESC';

  
  constructor(
    private axiosService: AxiosService,
    private router: Router,
  ) {}

  ngOnInit() {
  this.title = "Recommended for You"
  this.axiosService.getLoggedInUserOb().subscribe((user)=> {
    this.loggedInUser = user;
    this.axiosService.request('GET', '/products/recommended', {}, { userId: this.loggedInUser!.id })
    .then((response) => {
      console.log("recommended endpoint worked!");
      console.log("the results: ", response);
      this.products = response.data;
    })
  })
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
