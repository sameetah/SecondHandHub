import { Component, Input } from '@angular/core';
import { AxiosService } from '../../services/axios.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginFormComponent } from '../login-form/login-form.component';
import { AddProductComponent } from 'src/app/pages/add-product/add-product.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() pageTitle: string = "";


  constructor(private axiosService: AxiosService, private router: Router,public dialog: MatDialog) { }

  logout() {
    this.axiosService.logOut();
    this.router.navigate(['/home']);
  }

  navigateHome() {
    this.router.navigate(['/']);
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

  }

openLoginForm(): void{  
    const dialogRef = this.dialog.open(LoginFormComponent, {
      width: '450px',
      
    });

  
}

}
