import { Component } from '@angular/core';

@Component({
  selector: 'app-useful-links',
  templateUrl: './useful-links.component.html',
  styleUrls: ['./useful-links.component.scss']
})
export class UsefulLinksComponent {

  email: string = "";
  subscriptionSuccess: boolean = false;

  subscribe(){
    if(this.isValidEmail(this.email)) {
      this.subscriptionSuccess = true;
    } else {
      alert('Invalid email address');
    }
  }

  isValidEmail(email: string): boolean{
    const emailPattern =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

}
