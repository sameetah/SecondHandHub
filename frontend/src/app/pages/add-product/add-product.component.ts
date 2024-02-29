import { ChangeDetectorRef, Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/user';
import { AxiosService } from 'src/app/shared/services/axios.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Category,
  FilteredCategory,
  Product,
  SubCategory,
  SubSubCategory,
} from 'src/app/shared/models/product';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  editForm!: FormGroup;
  selectedFiles!: FileList;
  previewImages: any[] = [];
  loggedInUser: User | null = null;
  isDragging = false;
  selectedProcessedFiles: File[] = [];
  categories: Category[] = [];
  filteredCategories: FilteredCategory[] = [];

  subCategories: SubCategory[] = [];
  subsubCategory: SubSubCategory[] = [];
  selectedCategory: string = '';

  // add-product.component.ts

  constructor(
    private fb: FormBuilder,
    private axiosService: AxiosService,
    private uploadService: UploadService,
    private cd: ChangeDetectorRef,
    private router: Router,
    public dialogRef: MatDialogRef<AddProductComponent>,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.axiosService.getLoggedInUserOb().subscribe((user) => {
      this.loggedInUser = user;
    });
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data.map((category) => ({
        ...category,
        expanded: true,
      }));
      this.filteredCategories = this.categories;
    });

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      price: [0.0],
      location: [''],
      image_url: [''],
      inputField: [''],
      category: ['', Validators.required], // Added form control
    });
  }

  isCategory(item: any): boolean {
    return 'subCategories' in item;
  }

  filterCategories(event: KeyboardEvent) {
    const search = (event.target as HTMLInputElement).value
      .toLowerCase()
      .trim();

    if (search.length === 0) {
      this.filteredCategories = this.categories;
    } else {
      const filteredCategories: Category[] = [];

      for (const category of this.categories) {
        if (category.name.toLowerCase().includes(search)) {
          filteredCategories.push(category);
        } else {
          const matchingSubCategories: SubCategory[] =
            category.subCategories.filter((subCategory) =>
              subCategory.name.toLowerCase().includes(search)
            );

          if (matchingSubCategories.length > 0) {
            const filteredCategory: Category = {
              name: category.name,
              icon: category.icon,
              subCategories: matchingSubCategories,
              expanded: category.expanded,
            };
            filteredCategories.push(filteredCategory);
          } else {
            const matchingSubSubCategories: SubSubCategory[] =
              category.subCategories
                .flatMap((subCategory) => subCategory.subSubCategories)
                .filter((subSubCategory) =>
                  subSubCategory.name.toLowerCase().includes(search)
                );

            if (matchingSubSubCategories.length > 0) {
              const filteredCategory: Category = {
                name: category.name,
                icon: category.icon,
                subCategories: [
                  {
                    name: 'Other',
                    subSubCategories: matchingSubSubCategories,
                    expanded: false,
                  },
                ],
                expanded: category.expanded,
              };
              filteredCategories.push(filteredCategory);
            }
          }
        }
      }

      if (filteredCategories.length > 0) {
        this.filteredCategories = filteredCategories;
      } else {
        console.log('No matching categories or subcategories');
      }
    }
  }

  onCategorySelected(name: string) {
    console.log(name);
    this.selectedCategory = name;
  }

  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const canvas = document.createElement('canvas');
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject('Blob creation failed');
              }
            },
            file.type,
            0.3
          );
        }
      };
      image.onerror = reject;
    });
  }

  async selectFile(event: any) {
    this.selectedFiles = event.target.files;
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const originalFile = this.selectedFiles[i];

      if (originalFile.type.match(/image-*/)) {
        try {
          const resizedFile = await this.resizeImage(originalFile, 1024, 768); // set desired max dimensions

          let reader = new FileReader();
          reader.onload = (event: any) => {
            this.previewImages.push(event.target.result);
          };
          reader.readAsDataURL(resizedFile);
          const processedFile = new File([resizedFile], originalFile.name, {
            type: originalFile.type,
          });
          this.selectedProcessedFiles.push(processedFile);
        } catch (err) {
          console.error('Error resizing file:', err);
        }
      }
    }
    event.target.files = '';
  }

  removePreview(index: number) {
    this.previewImages.splice(index, 1);
  }

  async save(): Promise<void> {
    const promises = [];
    for (let i = 0; i < this.selectedProcessedFiles.length; i++) {
      promises.push(
        this.uploadService.uploadFile(this.selectedProcessedFiles[i])
      );
    }
    const urls = await Promise.all(promises);

    try {
      const response = await this.axiosService.request('POST', '/products', {
        title: this.editForm.value.title,
        description: this.editForm.value.description,
        price: this.editForm.value.price,
        location: this.editForm.value.location,
        user: this.loggedInUser,
        imageUrl: urls[0],
        category: this.selectedCategory,  
      });

      await Promise.all(
        urls.map((url) => {
          return this.axiosService.request('POST', '/productImages', {
            imageUrl: url,
            productId: response.data.id,
          });
        })
      );
      this.dialogRef.close();
      this.navigateToProduct(response.data.id);
    } catch (error) {
      console.error(error);
    }
  }

  navigateToProduct(id: string) {
    this.router.navigate(['/product/' + id]);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.previewImages,
      event.previousIndex,
      event.currentIndex
    );
  }

  onDragStart() {
    this.isDragging = true;
    this.cd.detectChanges();
  }
  onDragEnd() {
    this.isDragging = false;
    this.cd.detectChanges();
  }
}
