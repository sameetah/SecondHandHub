import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AxiosService } from 'src/app/shared/services/axios.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {
  componentToShow:string = 'welcome';

  constructor(private axiosService: AxiosService,     private router: Router) {}

  showComponent(componentToShow: string): void{
    this.componentToShow = componentToShow;
   
  }



getAllUsers(): void {
  this.axiosService.request(
    "Get",
    "/users",
    {
    
    }
  ).then(response => {
   
    })
}



}
