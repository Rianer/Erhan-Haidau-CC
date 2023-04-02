import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CityModel } from 'src/models/cityModel';
import { FileNameModel } from 'src/models/fileNames';
import { UserDataModel } from 'src/models/userData';
import { AudioService } from 'src/services/audioService/audio.service';
import { CityService } from 'src/services/citiesService/city.service';
import { ImageService } from 'src/services/imagesService/image.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'CityViewer';
  webapiurl = environment.webapiurl;
  currentCity: CityModel = new CityModel();
  audioSource: any;
  cityDataForm: FormGroup;
  imageList: FileNameModel[];
  citiesList: CityModel[];
  savingImageName: string;

  constructor(
    private fg: FormBuilder,
    private imgService: ImageService,
    private cityService: CityService,
    private audioService: AudioService
  ) {}

  ngOnInit(): void {
    this.cityDataForm = this.fg.group({
      tara: '',
      nume: '',
    });
    this.cityDataForm.valueChanges.subscribe();
    this.refreshAllCities();
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

  refreshAllCities(): void {
    this.cityService.getAllCities().subscribe((res) => {
      this.citiesList = res;
    });
  }

  getCityGeolocation() {
    this.currentCity.nume = this.cityDataForm.value.nume;
    this.currentCity.tara = this.cityDataForm.value.tara;
    this.cityService.getGeolocation(this.currentCity.nume).subscribe((res) => {
      this.currentCity.latitude = res.latitude;
      this.currentCity.longitude = res.longitude;
    });
  }

  uploadCity() {
    this.cityService.postCity(this.currentCity).subscribe((res) => {
      this.currentCity = res;
      console.log(this.currentCity);
      this.refreshAllCities();
      this.currentCity = new CityModel();
    });
  }

  onSubmit(): void {
    this.currentCity.nume = this.cityDataForm.value.nume;
    this.currentCity.tara = this.cityDataForm.value.tara;
    this.cityService.getGeolocation(this.currentCity.nume).subscribe((res) => {
      this.currentCity.latitude = res.latitude;
      this.currentCity.longitude = res.longitude;
      this.uploadCity();
    });
  }

  setAudio(city: CityModel): void {
    const text = 'The city of ' + city.nume + ' from ' + city.tara;
    this.audioService.getAudio(text).subscribe((res) => {
      console.log(res);
      let blob: any = new Blob([res], { type: res.type });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
}
