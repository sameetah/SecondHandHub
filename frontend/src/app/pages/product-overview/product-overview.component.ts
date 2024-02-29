import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { AxiosService } from 'src/app/shared/services/axios.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { Chat } from 'src/app/shared/models/chat';
import { Favorite } from 'src/app/shared/models/favorite';
import { NgToastService } from 'ng-angular-popup';
import { MatDialog } from '@angular/material/dialog';
import { MakeOfferComponent } from 'src/app/shared/components/make-offer/make-offer.component';

enum ButtonStatus {
  NotInFavorites = 'Add to Favorites',
  InFavorites = 'Remove from Favorites',
  NotSignedIn = 'Please create your own account to save this product',
}
@Component({
  selector: 'app-product-overview',
  templateUrl: './product-overview.component.html',
  styleUrls: ['./product-overview.component.scss'],
})
export class ProductOverviewComponent implements OnInit {
  product!: Product;
  productId!: number;
  loggedInUser: User | null = null;
  message: string = '';
  productImages: string[] = [];
  buttonStatus: ButtonStatus = ButtonStatus.NotInFavorites;
  favoriteProducts: Favorite[] = [];
  isProductInFavorites: boolean | undefined;

  constructor(
    private axiosService: AxiosService,
    private route: ActivatedRoute,
    private toast: NgToastService,
    public dialog: MatDialog
  ) {
    this.route.params.subscribe((params) => {
      this.productId = +params['id'];
      // Check the product's status based on productId
      this.isProductInFavorites;
    });
  }

  ngOnInit() {
    this.productImages = []
    this.axiosService.getLoggedInUserOb().subscribe((user) => {
      this.loggedInUser = user;

      //checks whether the product is already in the loggedin user's favorite list or not
      this.axiosService
        .request(
          'GET',
          '/products/favorites/check',
          {},
          { userId: this.loggedInUser!.id, productId: this.productId }
        )
        .then((response) => {
          this.isProductInFavorites = response.data;
          console.log(
            'favorite boolean value is: ' + this.isProductInFavorites
          );
          if (this.isProductInFavorites) {
            this.buttonStatus = ButtonStatus.InFavorites; // shows 'Remove from Favorites' option
          } else {
            this.buttonStatus = ButtonStatus.NotInFavorites; // shows 'Add to Favorites' option
          }
        });
    });

    this.route.paramMap.subscribe((params) => {
      let id = params.get('id');
      if (id) {
        this.productId = +id;
        this.loadProductDetails(this.productId);
      }
    });
  }

  loadProductDetails(productId: number) {
    // Reset productImages array for new product
    this.productImages = [];
  
    this.axiosService.request('GET', `/products/${productId}`, {})
      .then((response) => {
        this.product = response.data;
        this.loadProductImages(productId);
      });
  }
  
  loadProductImages(productId: number) {
    this.axiosService.request('GET', '/productImages', {}, { productId })
      .then((response) => {
        response.data.forEach((element: any) => {
          this.productImages.push(element.imageUrl);
        });
      });
  }

  async sendMessage(): Promise<void> {
    try {
      const response = await this.axiosService.request('POST', '/chats', {
        user1: this.loggedInUser,
        user2: this.product.user,
        product: this.product,
      });

      this.axiosService.request('POST', '/chatMessages', {
        content: this.message,
        chatId: response.data.id,
        sender: this.loggedInUser,
        timestamp: 1,
      });
    } catch (error) {
      console.error('There was an issue saving the chat: ', error);
    }
  }

  setMainImage(imageUrl: string): void {
    this.product.imageUrl = imageUrl;
  }

  async addToFavorites() {
    try {
      if (!this.loggedInUser) {
        //this.favoriteStatus = FavoriteStatus.NotSignedIn
        this.toast.error({
          detail: 'ERROR',
          summary: 'User is not logged in. Cannot add to favorites.',
          duration: 5000,
        });
        throw new Error('User is not logged in. Cannot add to favorites.');
      }
      const favoriteData = {
        userId: this.loggedInUser.id,
        productId: this.product,
      };
      this.axiosService
        .request('POST', '/products/favorites', favoriteData, {})
        .then((response) => {
          console.log('Favorite added: ', response.data);
          this.buttonStatus = ButtonStatus.InFavorites;
          this.isProductInFavorites = !this.isProductInFavorites;
            this.toast.success({detail:"ADDED",summary:'Added to Favorites',duration:2000});

          
          
        });
    } catch (error) {
      this.toast.error({detail:"UPS",summary:'There is an issue adding to favorites',duration:2000});

    }
  }

  removeFromFavorites() {
    try {
      const favoriteData = {
        userId: this.loggedInUser?.id,
        productId: this.product!,
      };
      this.axiosService
        .request('DELETE', 'products/favorites', favoriteData, {})
        .then((response) => {
          console.log('Favorite deleted: ', response.data);
          this.buttonStatus = ButtonStatus.NotInFavorites;
          this.isProductInFavorites = !this.isProductInFavorites;
          this.toast.success({detail:"REMOVED",summary:'Removed from Favorites',duration:2000});

        });
    } catch (error) {
      this.toast.error({detail:"UPS",summary:'There is an issue adding to favorites',duration:2000});

    }
  }

  openMessageForm(): void {
    if (this.loggedInUser == null) {
      this.toast.error({detail:"ERROR",summary:'To Contact the Seller, you need to be logged in!',duration:5000});

    } else {
      const dialogRef = this.dialog.open(MakeOfferComponent, {
        width: '450px',
        data: {
          product: this.product,
          user: this.loggedInUser,
        },
      });
    }
  }
}
