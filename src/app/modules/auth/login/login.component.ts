import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../common/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GlowTrackDirective } from '../../../common/directives/glow-track.directive';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    GlowTrackDirective
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm : FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, public snackbar: MatSnackBar, private router: Router){
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',[Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/task-list']);
        },
        error: () => {
          this.snackbar.open('Invalid username or password','close',{
            duration: 3000,
            panelClass:['error-popup'],
            horizontalPosition:'end',
            verticalPosition:'top'
          });
        }
      });
    }
  }
}
