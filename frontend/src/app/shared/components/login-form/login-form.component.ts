import { Component, EventEmitter, Output } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { AxiosService } from '../../services/axios.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  @Output() onSubmitLoginEvent = new EventEmitter();
  @Output() onSubmitRegisterEvent = new EventEmitter();

  constructor(
    private axiosService: AxiosService,
    private router: Router,
    public dialogRef: MatDialogRef<LoginFormComponent>,
    private toast: NgToastService

  ) {}

  active: string = 'login';
  firstName: string = '';
  secondName: string = '';
  login: string = '';
  password: string = '';

  onLoginTab(): void {
    this.active = 'login';
  }

  onRegisterTab(): void {
    this.active = 'register';
  }

  onLogin(): void {
    this.axiosService
      .request('POST', '/login', {
        login: this.login,
        password: this.password,
      })
      .then((response) => {
        this.axiosService.setAuthToken(response.data.token);
        this.axiosService.setLoggedInUser(response.data);
        this.dialogRef.close();
        this.router.navigate(['/home']);
        this.toast.success({detail:"SUCCESS",summary:'You are logged in!',duration:5000});
      }).catch((error) => {
        // Handle the error here
        this.toast.error({detail:"ERROR",summary:'Are your data correct?',duration:5000});
      });;
  }

  onRegister(): void {
    this.axiosService
      .request('POST', '/register', {
        firstName: this.firstName,
        secondName: this.secondName,
        login: this.login,
        password: this.password,
      })
      .then((response) => {
        this.axiosService.setAuthToken(response.data.token);
        this.axiosService.setLoggedInUser({
          id: response.data.id,
          firstName: response.data.firstName,
          secondName: response.data.secondName,
          imageUrl: response.data.imageUrl,
          login: response.data.login,
          joined: response.data.joined,
        });
        this.dialogRef.close();
        this.router.navigate(['/home']);
        this.toast.success({detail:"SUCCESS",summary:'You are registered!',duration:5000});

      });
  }



  navigateToPasswordRest() {
    this.dialogRef.close();
    this.router.navigate(['/passwordReset']);
  }
}
