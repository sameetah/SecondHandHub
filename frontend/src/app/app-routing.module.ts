import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { MyProductsComponent } from './pages/my-products/my-products.component';

import { SubcategoryListComponent } from './shared/components/subcategory-list/subcategory-list.component';
import { ContentComponent } from './pages/content/content.component';
import { ProductOverviewComponent } from './pages/product-overview/product-overview.component';
import { ChatOverviewComponent } from './pages/chat/chat-overview/chat-overview.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HomeComponent } from './shared/components/home/home.component';
import { SearchComponent } from './shared/components/search/search.component';
import { UsefulLinksComponent } from './shared/components/footer/useful-links/useful-links.component';
import { ResetFormComponent } from './pages/reset-form/reset-form.component';
import { ConfirmResetComponent } from './pages/confirm-reset/confirm-reset.component';
import { GetHelpComponent } from './shared/components/footer/get-help/get-help.component';
import { CompanyComponent } from './shared/components/footer/company/company.component';
import { UnsubscribeComponent } from './pages/unsubscribe/unsubscribe.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'start',
    component: ContentComponent,
  },
  {
    path: 'category/:name',
    component: SubcategoryListComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'myProducts',
    component: MyProductsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product/:id',
    component: ProductOverviewComponent,
  },
  {
    path: 'chats',
    component: ChatOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products/results/:query',
    component: SearchComponent,
  },
  {
    path: 'useful-links',
    component: UsefulLinksComponent,
  },
  {
    path: 'passwordReset',
    component: ResetFormComponent,
  },
  {
    path: 'confirmReset/:token',
    component: ConfirmResetComponent,
  },
  {
    path: 'get-help',
    component: GetHelpComponent,
  },
  {
    path: 'company',
    component: CompanyComponent,
  },
  {
    path:'favorites',
    component: FavoritesComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'newsletter/:email',
    component: UnsubscribeComponent,
  },
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64],
  onSameUrlNavigation: 'reload',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
