import {
  Component,
  Input,
  OnInit,
  NgZone,
  HostListener,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category, Product } from '../../models/product';
import { ProductLocationService } from '../../services/product-location.service';
import { AxiosService } from '../../services/axios.service';
import { Router } from '@angular/router';
import { HomeComponent } from 'src/app/shared/components/home/home.component';
import { AddProductComponent } from 'src/app/pages/add-product/add-product.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../models/user';
import { UserUpdateComponent } from 'src/app/shared/components/user-update/user-update.component'; // Update this import path

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('dropdownMenu', { static: false }) dropdownMenu!: ElementRef;
  @ViewChild('toggleButton', { static: false }) toggleButton!: ElementRef;
  submitSearch(val: string) {
    this.router.navigate([`products/results/${val}`]);
  }
  @Input() pageTitle: string = '';
  loggedInUser: User | null = null;
  showSearchBar: boolean = false;
  categories: Category[] = [];

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isSmallScreen = window.innerWidth <= 640;

  selectedLocation: string | null = null;
  locations: string[] = [];

  constructor(
    private axiosService: AxiosService,
    private router: Router,
    public dialog: MatDialog,
    private categoryService: CategoryService,
    private ngZone: NgZone,
    private productLocationService: ProductLocationService,
    private renderer: Renderer2
  ) {
    this.isSmallScreen = window.innerWidth <= 640;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.ngZone.run(() => {
      this.isSmallScreen = window.innerWidth <= 641;
    });
  }

  ngOnInit(): void {
    this.axiosService.getLoggedInUserOb().subscribe((user) => {
      this.loggedInUser = user;
    });
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
    this.productLocationService.getLocations().subscribe((data: string[]) => {
      this.locations = data;
    });
  }

  logout() {
    this.axiosService.logOut();

    // Close the dropdown
    const dropdownElement = this.dropdownMenu.nativeElement.parentNode.querySelector('.dropdown-menu');
    if (dropdownElement) {
      this.renderer.removeClass(dropdownElement, 'show');
    }

    // Close the offcanvas by triggering the button's click event
    this.toggleButton.nativeElement.click();

    this.router.navigate(['/home']);
}



  navigateHome() {
    this.router.navigate(['/']);
  }

  navigateToMyProfile() {
    this.router.navigate(['/myaccount']);
  }

  navigateToMyProducts() {
    this.router.navigate(['/myProducts']);
  }

  navigateToMyDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToMyChats() {
    this.router.navigate(['/chats']);
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '450px',
    });
    this.toggleButton.nativeElement.click();
  }

  toggleSearchBar(): void {
    this.showSearchBar = !this.showSearchBar;
  }
  openLoginForm(): void {
    const dialogRef = this.dialog.open(LoginFormComponent, {
      width: '450px',
    });
    this.toggleButton.nativeElement.click();
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(UserUpdateComponent, {
      width: '500px',
      data: { user: this.loggedInUser },
    });
    this.toggleButton.nativeElement.click();
  }

  navigateToMyFavoriteProducts() {
    this.router.navigate(['/favorites']);
  }
}
