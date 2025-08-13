import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() ToggleSidebar = new EventEmitter<boolean>();
  toggle  = false;
  constructor(private authService: AuthService, private router: Router){}

  logout(): void{
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar():void{
    this.ToggleSidebar.emit(!this.toggle);
  }
}
