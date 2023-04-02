import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileNameModel } from 'src/models/fileNames';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private ROOT_URL =
    'https://backend-component-dot-cloud-computing-382208.ew.r.appspot.com/files';
  constructor(private http: HttpClient) {}

  getImageList(): Observable<FileNameModel[]> {
    return this.http.get<FileNameModel[]>(this.ROOT_URL);
  }

  getImage(name: string): Observable<any> {
    return this.http.get(this.ROOT_URL + '/' + name, { responseType: 'blob' });
  }

  uploadImage(file: any): Observable<any> {
    const url = this.ROOT_URL + '/upload';
    const formParams = new FormData();
    formParams.append('file', file);
    return this.http.post(url, formParams);
  }
}
