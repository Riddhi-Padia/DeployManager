import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../header/header/header.component';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    HeaderComponent,
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    SidebarComponent
],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  @ViewChild('drawer') drawer:MatDrawer|undefined;

  toggleSideBar():void{
    this.drawer?.toggle();
  }
}
