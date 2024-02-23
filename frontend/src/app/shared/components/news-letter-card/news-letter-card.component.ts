import { Component } from '@angular/core';
import { AxiosService } from '../../services/axios.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-news-letter-card',
  templateUrl: './news-letter-card.component.html',
  styleUrls: ['./news-letter-card.component.scss'],
})
export class NewsLetterCardComponent {
  constructor(
    private axiosService: AxiosService,
    private toast: NgToastService

  ) {}
  email: string = '';

  onSubscribe() {
    this.axiosService
      .request('POST', '/newsletter', { email: this.email }, {})
      .then((response) => {
        this.toast.success({detail:"SUCCESS",summary:'You are subscribed now!',duration:5000});

      });
  }

}
