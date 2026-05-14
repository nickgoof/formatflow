import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FormatFlowService {

  constructor(private http: HttpClient) { }

  convertFile(file: File, targetFormat: string): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    // HIER KORRIGIERT: kleines 'f' bei target_format
    formData.append('target_format', targetFormat);

    return this.http.post(`/convert/`, formData, {
      responseType: 'blob'
    });
  }

  // targetFormat als Parameter hinzugefügt
  upscaleImage(file: File, targetFormat: string): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_format', targetFormat);
    // 'factor' entfernt, da dein Python-Backend bei upscale keinen factor erwartet

    return this.http.post(`/upscale/`, formData, {
      responseType: 'blob'
    });
  }

  // targetFormat als Parameter hinzugefügt
  downscaleImage(file: File, factor: number, targetFormat: string): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('factor', factor.toString());
    formData.append('target_format', targetFormat);

    return this.http.post(`/downscale/`, formData, {
      responseType: 'blob'
    });
  }

}
