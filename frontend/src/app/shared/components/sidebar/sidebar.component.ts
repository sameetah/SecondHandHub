import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import {
  Category,
  FilteredCategory,
  SubCategory,
  SubSubCategory,
} from '../../models/product';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  categories: Category[] = [];
  showSelectedCategory = false;
  filteredCategories: FilteredCategory[] = [];
  selectedCategoryName: string = 'Categories';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data.map((category) => ({
        ...category,
        expanded: false,
      }));
    });
  }

  toggleExpansion(item: Category | SubCategory): void {
    item.expanded = !item.expanded;

    // Check the existence of the 'subSubCategories' property to distinguish between Category and SubCategory
    if (!('subSubCategories' in item)) {
      // It's a Category
      this.categories.forEach((category) => {
        if (category !== item) {
          category.expanded = false;
          if (category.subCategories) {
            category.subCategories.forEach((subCategory) => {
              subCategory.expanded = false;
            });
          }
        }
      });
    } else {
      // It's a SubCategory
      this.categories.forEach((category) => {
        if (category.subCategories) {
          category.subCategories.forEach((subCategory) => {
            if (subCategory !== item) {
              subCategory.expanded = false;
            }
          });
        }
      });
    }
  }

  displaySubSubCategory(
    subSubCategory: SubSubCategory | SubCategory | Category
  ): void {
    this.categoryService.subCategorySelected(subSubCategory);
    this.selectedCategoryName = 'Products from ' + subSubCategory.name;
  }
}
