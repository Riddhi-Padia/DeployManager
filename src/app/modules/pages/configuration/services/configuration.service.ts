import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { dropdownItem } from '../models/dropdown-item/dropdown-item';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  //get all task status
  getAllTaskStatus(): Observable<dropdownItem[]>{
    return this.http.get<{id: string, value: string}[]>(`${this.apiUrl}/TaskStatus`);
  }

  getAllTaskTypes(): Observable<dropdownItem[]>{
    return this.http.get<dropdownItem[]>(`${this.apiUrl}/TaskTypes`);
  }

  getAllTaskPriority(): Observable<dropdownItem[]>{
    return this.http.get<dropdownItem[]>(`${this.apiUrl}/Priority`);
  }

  addTaskStatus(status: dropdownItem): Observable<dropdownItem>{
    return this.http.post<dropdownItem>(`${this.apiUrl}/TaskStatus`,status);
  }

  updateTaskStatus(status: dropdownItem): Observable<dropdownItem>{
    return this.http.put<dropdownItem>(`${this.apiUrl}/TaskStatus/${Number(status.id)}`,status);
  }

  deleteTaskStatus(status: dropdownItem): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/TaskStatus/${status.id}`);
  } 

  addTaskPriority(priority: dropdownItem): Observable<dropdownItem>{
    return this.http.post<dropdownItem>(`${this.apiUrl}/Priority`,priority);
  }

  updateTaskPriority(priority: dropdownItem): Observable<dropdownItem>{
    return this.http.put<dropdownItem>(`${this.apiUrl}/Priority/${Number(priority.id)}`,priority);
  }

  deleteTaskPriority(priority: dropdownItem): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/Priority/${priority.id}`);
  } 

  
  addTaskType(type: dropdownItem): Observable<dropdownItem>{
    return this.http.post<dropdownItem>(`${this.apiUrl}/TaskTypes`,type);
  }

  updateTaskType(type: dropdownItem): Observable<dropdownItem>{
    return this.http.put<dropdownItem>(`${this.apiUrl}/TaskTypes/${Number(type.id)}`,type);
  }

  deleteTaskType(type: dropdownItem): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/TaskTypes/${type.id}`);
  } 
}
