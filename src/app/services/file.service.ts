import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  // upload(formData: FormData): Observable<any> {
  //   return this.http.post<string[]>(`${environment.apiUrl}/file/upload`, formData, {
  //   });
  // }

  upload(formData: FormData): Observable<HttpEvent<any>> {
    const request = new HttpRequest('POST', `${environment.apiUrl}/file/upload`, formData, {
      reportProgress: true, // Enable progress tracking
    });

    return this.http.request(request);

  }

  download(fileId: string) {
    return this.http.get(`${environment.apiUrl}/file/${fileId}`, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  delete(fileId: string) {
    return this.http.delete(`${environment.apiUrl}/file/${fileId}`, {
    });
  }

  getFileInfo(fileId: string, password: string) {
    return this.http.post(`${environment.apiUrl}/file/${fileId}`, {password :password
    });
  }

  checkLockedFile(fileId: string) {
    return this.http.get(`${environment.apiUrl}/file/is-locked?fileId=${fileId}`,{});
  }

}
