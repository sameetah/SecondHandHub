import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomProduct } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class SearchProductService {
  private baseUrl = 'https://fakestoreapi.com/products/';
  //need to be replaced with our url!
  
  constructor(private HttpClient: HttpClient) {}

  searchProduct(query: string): Observable<CustomProduct[]> {
    const searchUrl = `${this.baseUrl}${query}`;

   return this.HttpClient.get<CustomProduct[]>(searchUrl);
  }
  
}


