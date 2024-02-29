import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
} from '@angular/core';
import { Category, SubCategory, SubSubCategory } from '../../models/product';
import { CategoryService } from '../../services/category.service';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorie-overview',
  templateUrl: './categorie-overview.component.html',
  styleUrls: ['./categorie-overview.component.scss'],
})
export class CategorieOverviewComponent {
  responsiveOptions: any[] | undefined;
  @ViewChild('recipeCarousel') recipeCarousel!: ElementRef;
  categories: Category[] = [];
  @ViewChildren('carouselItem') carouselItems!: QueryList<any>;

  constructor(
    private categoryService: CategoryService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.ngZone.runOutsideAngular(() => {
        // Code that runs outside the Angular zone
        this.categories = data.map((category) => ({
          ...category,
          expanded: false,
        }));
        console.log(this.categories);

        // Run change detection explicitly to update the view
        this.ngZone.run(() => {
          this.cdr.detectChanges();
        });
      });
    });
    this.responsiveOptions = [
      {
        breakpoint: '3000px',
        numVisible: 5,
        numScroll: 1,
      },
      {
        breakpoint: '1309px',
        numVisible: 4,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '500px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  displaySubSubCategory(
    subSubCategory: SubSubCategory | SubCategory | Category
  ): void {
    this.categoryService.subCategorySelected(subSubCategory);
  }
}
