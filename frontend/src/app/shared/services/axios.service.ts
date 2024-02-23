import { Injectable } from '@angular/core';
import axios from 'axios';
import { User } from '../models/user';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Favorite } from '../models/favorite';

@Injectable({
  providedIn: 'root',
})
export class AxiosService {
  private loggedInUser: User | null = null;
  private loggedInUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  constructor(private router: Router) {
    axios.defaults.baseURL = 'http://85.215.57.188/api';
    axios.defaults.headers.post['Content-type'] = 'application/json';
    this.initializeUserFromToken();
  }

  private async initializeUserFromToken(): Promise<void> {
    const token = this.getAuthToken();
    if (token) {
      try {
        await this.getLoggedInUser();
      } catch (error) {
        console.error('Error initializing user from token:', error);
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

  logOut(): void {
    window.localStorage.removeItem('auth_token');
    this.loggedInUser = null;
    this.loggedInUserSubject.next(this.loggedInUser);
  }

  request(
    method: string,
    url: string,
    data: any,
    query: any = {}
  ): Promise<any> {
    let headers = {};
    console.log(data, 'data')

    if (this.getAuthToken() !== null) {
      headers = { Authorization: 'Bearer ' + this.getAuthToken() };
    }

    console.log('Headers:', headers);
    return axios({
      method: method,
      url: url,
      data: data,
      headers: headers,
      params: query,
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          if (error.response.data.newToken)
            this.setAuthToken(error.response.data.newToken);
        }
        if (error.message === 'Request failed with status code 403') {
          console.log(error.message);
        }
        throw error;
      });
  }

  // Inside AxiosService
  async getLoggedInUser(): Promise<User | null> {
    const token = this.getAuthToken();
    if (!this.loggedInUser && token) {
      try {
        const decodedToken: any = jwt_decode(token);
        await this.request('GET', '/users/' + decodedToken.id, {}).then(
          (response) => {
            if (response && response.data) {
              this.loggedInUser = response.data;
              this.loggedInUserSubject.next(this.loggedInUser);
            } else {
              throw new Error('Unexpected response format');
            }
          }
        );
      } catch (error) {
        console.error(`Failed to decode token: ${error}`);
      }
    }

    return new Promise((resolve, reject) => {
      if (this.loggedInUser) {
        resolve(this.loggedInUser);
      } else {
        reject('No logged in user');
      }
    });
  }

  getLoggedInUserOb(): Observable<User | null> {
    return this.loggedInUserSubject.asObservable();
  }

  setLoggedInUser(user: User | null): void {
    this.loggedInUserSubject.next(user);
  }
  // addToFavorites(favorite: Favorite): Observable<Favorite> {
  //   const url = `${axios.defaults.baseURL}/products/favorites` //endpoint url
  //   console.log("favorite.ts.file  succeeded");
  //   return this.http.post<Favorite>(url, favorite)
  // }
}
