import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private authState = new BehaviorSubject<boolean>(this.checkAuthStatus());

    // login method
    login(credentials: {username: string, password: string}): Observable<boolean> {

      if(credentials.username === 'admin' && credentials.password === 'admin123')
      {
        this.authState.next(true);
        localStorage.setItem('logintoken','safksjfgsdfjsdfbsodifusdhf-34fkjsfsd87f@2');
        return of(true);
      }
      else{
        return throwError(() => new Error('Invalid credentials'));
      }
    }

    private checkAuthStatus(): boolean{
      return !!localStorage.getItem('logintoken');
    }

    // method to logout the user
    logout(): void {
      this.authState.next(false);
      localStorage.removeItem('logintoken');
    }

    // method to autheticate the user
    isAuthenticated() : Observable<boolean>{
      return this.authState.asObservable();
    }
}
