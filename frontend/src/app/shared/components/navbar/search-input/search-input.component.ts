import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  searchInput: FormControl
  showSearchInput: boolean = false;

  constructor(    private router: Router) {
    this.searchInput = new FormControl

  }

  submitSearch(val: string) {
    console.log(val, "Value test");
    this.router.navigate([`products/results/${val}`]);
  }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      console.log(val instanceof NavigationEnd)
      if(val instanceof NavigationEnd) {
        console.log(val.url);

        const url = val.url;
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];
        
        console.log(lastPart, "last part!");

        this.searchInput.setValue(lastPart);
      }

    });
  }

  

}
