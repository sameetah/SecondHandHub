import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Category,
  PageResponse,
  Product,
  SubCategory,
  SubSubCategory,
} from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriesUrl = 'assets/categories.json';
  private baseURL = 'http://85.215.57.188/api';
  private selectedCategorySubject = new BehaviorSubject<
    SubSubCategory | Category | SubCategory
  >({
    name: '',
    subCategories: [],
    expanded: false,
    subSubCategories: [],
  });
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }

  subCategorySelected(subCategory: SubSubCategory | Category | SubCategory) {
    /* : Observable<Product[]> {
    const apiUrl = `${this.baseURL}/product/find/all/${subCategory.name}`;
    return this.http.get<Product[]>(apiUrl); */
    this.selectedCategorySubject.next(subCategory);
  }

  getProductsByCategory(
    category: string,
    page: number,
    size: number
  ): Observable<PageResponse<Product>> {
    const apiUrl = `${this.baseURL}/products?categories=${category}&page=${page}&size=${size}`;
    return this.http.get<PageResponse<Product>>(apiUrl);
  }
}
