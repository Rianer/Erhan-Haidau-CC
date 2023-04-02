import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CityModel } from 'src/models/cityModel';
import { GeolocationModel } from 'src/models/geolocationModel';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private ROOT_URL: string = 'https://cloud-computing-382208.ew.r.appspot.com';
  constructor(private http: HttpClient) {}

  getAllCities(): Observable<CityModel[]> {
    const url = this.ROOT_URL + '/orase';
    return this.http.get<CityModel[]>(url);
  }

  getGeolocation(city: string): Observable<GeolocationModel> {
    const url = this.ROOT_URL + '/geocode/address=' + city;
    return this.http.get<GeolocationModel>(url);
  }

  postCity(city: CityModel): Observable<CityModel> {
    const url = this.ROOT_URL + '/orase';
    return this.http.post<CityModel>(url, city);
  }
}
