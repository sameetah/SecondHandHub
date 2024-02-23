import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CustomProduct } from '../models/product';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  private baseUrl = 'https://fakestoreapi.com/products/category/';

  constructor(private httpClient: HttpClient) {}

  getProductList(subcatagory: string): Observable<CustomProduct[]> {
    const searchUrl = `${this.baseUrl}${subcatagory}`;

    return this.httpClient.get<CustomProduct[]>(searchUrl);
  }
}
