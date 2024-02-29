import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { CategoryService } from '../../services/category.service';
import { Category, SubCategory, SubSubCategory } from '../../models/product';

@Component({
  selector: 'app-subcategory-list',
  templateUrl: './subcategory-list.component.html',
  styleUrls: ['./subcategory-list.component.scss'],
})
export class SubcategoryListComponent implements OnInit {
  category!: Category | SubCategory | SubSubCategory;
  products: Product[] = [];
  page = 1;
  size = 4;
  totalElements = 0;

  constructor(
    private service: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      const categoryName = params['name'];

      if (categoryName) {
        // ... fetch your data based on the new categoryName ...
        this.service.selectedCategory$.subscribe((category) => {
          this.category = category;
          console.log('Category received', category);
          this.products = [];
          this.fetchDataRecursive(category);
        });
      }
    });
  }

  fetchDataRecursive(category: Category | SubCategory | SubSubCategory) {
    this.fetchProducts(category.name, this.page - 1, this.size);

    if ('subCategories' in category) {
      for (const subcategory of category.subCategories) {
        this.fetchDataRecursive(subcategory);
      }
    } else if ('subSubCategories' in category) {
      for (const subsubcategory of category.subSubCategories) {
        this.fetchDataRecursive(subsubcategory);
      }
    } else {
    }
  }

  fetchProducts(categoryName: string, page: number, size: number) {
    this.service
      .getProductsByCategory(categoryName, page, size)
      .subscribe((pageResponse) => {
        console.log(pageResponse); // Log the entire page response
        this.products = this.products.concat(pageResponse.content); // Update products
        this.totalElements = pageResponse.totalElements; // Update total elements for pagination
        // ... You can also extract and use other pagination info as needed
      });
  }
}
