import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';
import { nanoid } from 'nanoid';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private storage: AngularFireStorage) { }

  uploadFile(file: File) {
    const currentDate = new Date();
    const uniqueSuffix = nanoid(); 
    const timestamp = currentDate.getTime();
    const filePath = `files/${timestamp}_${uniqueSuffix}`; // Update this path
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // Get uploaded file's download URL and store it
    return new Promise<any>((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(downloadURL => {
            resolve(downloadURL);
          }, error => {
            reject(error);
          });
        })
      ).subscribe();
    });
  }
}
