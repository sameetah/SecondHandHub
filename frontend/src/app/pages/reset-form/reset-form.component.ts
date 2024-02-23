import { Component, EventEmitter, Output } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { AxiosService } from '../../shared/services/axios.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-form',
  templateUrl: './reset-form.component.html',
  styleUrls: ['./reset-form.component.scss']
})
export class ResetFormComponent {
  @Output() onSubmitLoginEvent = new EventEmitter();
  @Output() onSubmitRegisterEvent = new EventEmitter();

  constructor(
    private axiosService: AxiosService,
    private router: Router,
  ) {}

  login: string = '';

  onReset() {
    this.axiosService.request('POST', '/reset', {email: this.login},{}).then(response => {
      this.navigateToConfirmReset() 

    });
  }

  navigateToConfirmReset() {
    this.router.navigate(['/confirmReset/Code']);
  }
}
