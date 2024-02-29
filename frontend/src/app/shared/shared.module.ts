import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelativeTimePipe } from '../shared/pipes/relativeTime.pipe';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProductComponent } from './components/product/product.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthContentComponent } from './components/auth-content/auth-content.component';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { CarouselComponent } from './components/home/carousel/carousel.component';
import { CoverComponent } from './components/home/cover/cover.component';
import { AlertModule } from '@coreui/angular';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatSelectModule } from '@angular/material/select';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { SubcategoryListComponent } from './components/subcategory-list/subcategory-list.component';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SearchComponent } from './components/search/search.component';
import { FooterComponent } from './components/footer/footer.component';
import { UsefulLinksComponent } from './components/footer/useful-links/useful-links.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EuroPipe } from './pipes/euro.pipe';
import { NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategorieOverviewComponent } from './components/categorie-overview/categorie-overview.component';
import { BrandsSliderComponent } from './components/brands-slider/brands-slider.component';
import { NewestProductsComponent } from './components/newest-products/newest-products.component';
import { ReducedCardsComponent } from './components/reduced-cards/reduced-cards.component';
import { NewsLetterCardComponent } from './components/news-letter-card/news-letter-card.component';
import { RelatedProductsComponent } from './components/related-products/related-products.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { GetHelpComponent } from './components/footer/get-help/get-help.component';

import { CompanyComponent } from './components/footer/company/company.component';
import { SearchInputComponent } from './components/navbar/search-input/search-input.component';
import { RecommendedComponent } from './components/home/recommended/recommended.component';
import { MakeOfferComponent } from './components/make-offer/make-offer.component';
import { CarouselModule } from 'primeng/carousel';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    MatSelectModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyBea9zB3pbvyy823dJ2si_V4l3H-1RNH1w',
      authDomain: 'prject3-1c0c8.firebaseapp.com',
      projectId: 'prject3-1c0c8',
      storageBucket: 'prject3-1c0c8.appspot.com',
      messagingSenderId: '644815813543',
      appId: '1:644815813543:web:2e33306fb8cea566ca5482',
      measurementId: 'G-HJN7LD89TT',
    }),
    RouterModule,
    DragDropModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    NgFor,
    NgxPaginationModule,
    CarouselModule,
    
  ],
  declarations: [
    SubcategoryListComponent,
    AuthContentComponent,
    ButtonsComponent,
    HeaderComponent,
    LoginFormComponent,
    ProductComponent,
    SidebarComponent,
    RelativeTimePipe,
    HomeComponent,
    CarouselComponent,
    CoverComponent,
    NavbarComponent,
    SearchComponent,
    FooterComponent,
    UsefulLinksComponent,
    EuroPipe,
    CategorieOverviewComponent,
    BrandsSliderComponent,
    NewestProductsComponent,
    ReducedCardsComponent,
    NewsLetterCardComponent,
    RelatedProductsComponent,
    GetHelpComponent,
    CompanyComponent,
    SearchInputComponent,
    RecommendedComponent,
    MakeOfferComponent
  ],
  exports: [
    AuthContentComponent,
    ButtonsComponent,
    HeaderComponent,
    LoginFormComponent,
    ProductComponent,
    SidebarComponent,
    RelativeTimePipe,
    FormsModule,
    ReactiveFormsModule,
    HomeComponent,
    CarouselComponent,
    CoverComponent,
    NavbarComponent,
    DragDropModule,
    FooterComponent,
    NewestProductsComponent,
    RelatedProductsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
