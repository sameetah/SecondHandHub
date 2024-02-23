import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

import { AxiosService } from 'src/app/shared/services/axios.service';
import { User } from './shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private loggedInUser: User | null = null;

  constructor(private axiosService: AxiosService, private router: Router) {
    this.axiosService.getLoggedInUserOb().subscribe((user) => {
      this.loggedInUser = user;
    });
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const token = this.axiosService.getAuthToken();

    if (token && !this.loggedInUser) {
      try {
        await this.axiosService.getLoggedInUser();
        return true;
      } catch (error) {
        console.log('Error fetching logged-in user:', error);
        this.router.navigate(['/home']);
        return false;
      }
    } else if (token && this.loggedInUser) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
