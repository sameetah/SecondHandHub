import { Component, EventEmitter, Output } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { AxiosService } from '../../shared/services/axios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-reset',
  templateUrl: './confirm-reset.component.html',
  styleUrls: ['./confirm-reset.component.scss'],
})
export class ConfirmResetComponent {
  @Output() onSubmitLoginEvent = new EventEmitter();
  @Output() onSubmitRegisterEvent = new EventEmitter();
  login: string = '';
  password: string = '';
  confirmPassword: string = '';
  token: string = '';

  constructor(
    private axiosService: AxiosService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let token = params.get('token');
      if (token != null) {
        this.token = token;
      }
    });
  }

  onConfirm() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Continue with form submission if passwords match
    this.axiosService.request(
      'POST',
      '/confirm',
      {
        email: this.login,
        newPassword: this.password,
        code: this.token,
      },
      {}
    ).then((response) => {
      this.router.navigate(['/home']);
    });
  }
}
