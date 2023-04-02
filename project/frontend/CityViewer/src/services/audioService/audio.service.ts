import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private ROOT_URL =
    'https://cloud-computing-382208.ew.r.appspot.com/synthesize';
  constructor(private http: HttpClient) {}

  getAudio(city: string): Observable<any> {
    const msg = {
      text: city,
    };
    return this.http.post(this.ROOT_URL, msg, { responseType: 'blob' });
  }
}
