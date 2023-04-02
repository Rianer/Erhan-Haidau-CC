import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { FileNameModel } from 'src/models/fileNames';
import { UserDataModel } from 'src/models/userData';
import { ImageService } from 'src/services/imagesService/image.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'CityViewer';
  webapiurl = environment.webapiurl;
  currentUserData: UserDataModel;
  userDataForm: FormGroup;
  imageList: FileNameModel[];
  savingImageName: string;

  constructor(private fg: FormBuilder, private imgService: ImageService) {}

  ngOnInit(): void {
    this.userDataForm = this.fg.group({
      name: '',
      country: '',
      city: '',
    });
    this.userDataForm.valueChanges.subscribe();
  }

  onSubmit(): void {
    console.log(this.userDataForm.value);
  }

  showImageList(): void {
    this.imgService.getImageList().subscribe((res) => {
      this.imageList = res;
    });
  }

  allowFetchImages(): boolean {
    if (this.imageList === undefined) return true;
    return false;
  }

  saveFile(): void {
    this.imgService.getImage(this.savingImageName).subscribe((res: any) => {
      console.log(res);
      let blob: any = new Blob([res], { type: res.type });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  selectFile(event: Event): void {
    const element = <HTMLInputElement>event.target;
    if (element.files !== null) {
      const file = element.files[0];
      this.imgService.uploadImage(file).subscribe(
        (res) => {
          console.log('Done');
          this.showImageList();
        },
        (err) => {
          if (err.statusText === 'OK') {
            console.log('Done');
            this.showImageList();
          }
        }
      );
    }
  }
}
