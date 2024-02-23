import { Component, Inject } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AxiosService } from 'src/app/shared/services/axios.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss'],
})
export class UserUpdateComponent {
  public editUser!: User;
  public editForm!: FormGroup;
  selectedFiles!: FileList;
  downloadURL: Observable<string> | undefined;
  isUploading = false;
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserUpdateComponent>,
    private fb: FormBuilder,
    private axiosService: AxiosService,
    private uploadService: UploadService
  ) {}

  ngOnInit() {
    this.editUser = this.data.user;
    this.editForm = this.fb.group({
      firstName: [this.editUser.firstName, Validators.required],
      secondName: [this.editUser.secondName],
    });
  }

  save(): void {
    this.axiosService
      .request(
        'PUT',
        'users/' + this.editUser.id,
        {
          id: this.editUser.id,
          imageUrl: '',
          firstName: this.editForm.value.firstName,
          secondName: this.editForm.value.secondName,
        },
        {}
      )
      .then(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }

  selectFile(event: any) {
    this.isUploading = true;
    this.selectedFiles = event.target.files;
    this.uploadService.uploadFile(this.selectedFiles[0]).then((url) => {
      this.axiosService
        .request(
          'PUT',
          'users/' + this.editUser.id,
          {
            imageUrl: url,
          },
          {}
        )
        .then(() => {
          this.editUser.imageUrl = url;
          this.isUploading = false;
        });
    });
  }
}
