import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DeployService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addDeployment(JSON: any): Observable<any>{
    console.log("calling on", `${this.apiUrl}/start-build`);
    return this.http.post(`${this.apiUrl}/start-build`, JSON);
  }
}
