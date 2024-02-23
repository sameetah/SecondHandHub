import { Component } from '@angular/core';

@Component({
  selector: 'app-get-help',
  templateUrl: './get-help.component.html',
  styleUrls: ['./get-help.component.scss']
})
export class GetHelpComponent {

  email: string = '';
  message: string = '';
  response: string = '';

  submitForm() {
    if (this.email && this.message) {
      // Perform any necessary actions (e.g., sending data to the server)
      this.response = "Message sent successfully!";
    } else {
      this.response = "Please fill in both email and message fields.";
    }
  }
}
