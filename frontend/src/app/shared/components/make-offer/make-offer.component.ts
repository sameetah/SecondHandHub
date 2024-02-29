import { Component, Inject } from '@angular/core';
import { Product } from '../../models/product';
import { User } from '../../models/user';
import { AxiosService } from '../../services/axios.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-make-offer',
  templateUrl: './make-offer.component.html',
  styleUrls: ['./make-offer.component.scss'],
})
export class MakeOfferComponent {
  product!: Product;
  message: string = '';
  loggedInUser: User | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private axiosService: AxiosService,
    public dialogRef: MatDialogRef<MakeOfferComponent>
  ) {
    if (data.product && data.user) {
      this.product = data.product;
      this.loggedInUser = data.user;

    }
  }

  async sendMessage(): Promise<void> {
    console.log(this.product);
    console.log(this.loggedInUser);
  
    try {
      const response = await this.axiosService.request('POST', '/chats', {
        user1: this.loggedInUser,
        user2: this.product.user,
        product: this.product,
      });
  
      await this.axiosService.request('POST', '/chatMessages', {
        content: this.message,
        chatId: response.data.id,
        sender: this.loggedInUser,
        timestamp: 1,
      });
  
      // Close the dialog after successful message send
      this.dialogRef.close();
  
    } catch (error) {
      console.error('There was an issue saving the chat: ', error);
    }
  }
  
}