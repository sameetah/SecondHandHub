import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AxiosService } from 'src/app/shared/services/axios.service';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss']
})
export class UnsubscribeComponent {
  constructor(
    private axiosService: AxiosService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService

  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let email = params.get('email');
      if (email != null) {
        this.axiosService.request('DELETE', '/newsletter', {email: email},{}).then(response => {
          this.toast.success({detail:"SUCCESS",summary:'You are not subscribed anymore!',duration:5000});

        });
      }
    });
  }
}