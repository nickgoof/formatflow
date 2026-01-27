import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const URL = 'http://localhost:8000';

@Injectable({
  providedIn: 'root'
})
export class FormatFlowService {

  constructor(private http: HttpClient) { }

  convertFile(file: File, targetFormat: string): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);

    return this.http.post(`${URL}/convert`, formData, {
      responseType: 'blob'
    });
  }

}
