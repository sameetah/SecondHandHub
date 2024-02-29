import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { Favorite } from '../models/favorite';


@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://85.215.57.188/api';

  addToFavorites(favorite: Favorite): Observable<Favorite> {
    const url = `${this.apiUrl}/products/favorites` //endpoint url
    console.log("favorite.ts.file  succeeded");
    return this.http.post<Favorite>(url, favorite)
  }
/*
  private async initializeUserFromToken(): Promise<void> {
    const token = this.getAuthToken();
    if (token) {
      try {
        await this.getLoggedInUser();
      } catch (error) {
        console.error("Error initializing user from token:", error);
      }
    }
  }
  getAuthToken(): string | null {
    return window.localStorage.getItem('auth_token');
  }

  setAuthToken(token: string | null): void {
    if (token !== null) {
      return window.localStorage.setItem('auth_token', token);
    } else {
      window.localStorage.removeItem('auth_token');
    }
  }
*/
}
