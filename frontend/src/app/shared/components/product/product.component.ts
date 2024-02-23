import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import { AxiosService } from '../../services/axios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @Input() product!: Product;

  constructor(private router: Router){}


  navigatoToProduct(){
  this.router.navigate(['/product/'+this.product.id]);}


}
