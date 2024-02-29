import { Injectable } from '@angular/core';
import { AxiosService } from './axios.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private products: Product[] = [];
  private products$ = new BehaviorSubject<Product[]>([]);
  constructor(private axiosService: AxiosService,
              private http: HttpClient,) {}

  private baseUrl = 'http://85.215.57.188/api/products';




  fetchProducts(): void {
    this.axiosService
      .request("GET", "/products/results", {})
      .then((response) => {
        this.products = response.data;
        this.products$.next(this.products);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      });
  }

  getProductsForInput(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  getProductsByKeyword(keyword: string): Observable<Product[]> {
    const url = `${this.baseUrl}/results?keyword=${keyword}`;
        console.log('url request:',url)
    return this.http.get<Product[]>(url);
  }

  getProductsByUserInut(formDataResult: string): Observable<Product[]> {
    const url = `${this.baseUrl}/results?${formDataResult}`;
        console.log('url request:',url)
    return this.http.get<Product[]>(url);
  }
}
