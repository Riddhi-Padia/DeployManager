import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TaskListService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all tasks
  getTaskList(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl+'/Tasks');
  }

  // Get a task by ID
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/Tasks/${id}`);
  }

  // Add a new task
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl+'/Tasks', task);
  }

  // Update an existing task
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}'/Tasks'/${task.id}`, task);
  }

  // Delete a task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Tasks/${id}`);
  }
}
