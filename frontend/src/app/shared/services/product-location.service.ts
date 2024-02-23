import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import axios, { AxiosResponse } from 'axios';
import { AxiosService } from './axios.service';

@Injectable({
  providedIn: 'root'
})
export class ProductLocationService {
  private locations: string[] = [];
  private locations$ = new BehaviorSubject<string[]>([]);
  constructor(private axiosService: AxiosService) {

    this.axiosService.request("GET", "/products/location", {})
      .then((response) => {
        this.locations = (response.data)
        this.locations$.next(this.locations)
      });
  }

  getLocations(): Observable<string[]>{
    return this.locations$.asObservable()
  }
}

