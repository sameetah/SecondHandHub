import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductOverviewComponent } from './product-overview/product-overview.component';
import { SharedModule } from '../shared/shared.module';
import { MyProductsComponent } from './my-products/my-products.component';
import { ChatOverviewComponent } from './chat/chat-overview/chat-overview.component';
import { UserUpdateComponent } from '../shared/components/user-update/user-update.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ContentComponent } from './content/content.component';
import { ResetFormComponent } from '../pages/reset-form/reset-form.component';
import { ConfirmResetComponent } from './confirm-reset/confirm-reset.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { FavoritesComponent } from './favorites/favorites.component';



@NgModule({
  declarations: [
    MyProductsComponent,
    ProductOverviewComponent,
    ChatOverviewComponent,
    UserUpdateComponent,
    AddProductComponent,
    ContentComponent,
    ResetFormComponent,
   ConfirmResetComponent,
   UnsubscribeComponent,
    FavoritesComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
  ]
})
export class PagesModule { }
