import { Routes } from '@angular/router';
import { authGuard } from './common/guards/auth.guard';
import { loginGuard } from './common/guards/login.guard';

export const routes: Routes = [

    { path:'', redirectTo: '/task-list', pathMatch:'full'},

    { path: 'login', title:'Login', loadComponent: ()=>  import('./modules/auth/login/login.component').then(res => res.LoginComponent), canActivate:[loginGuard] },

    { path:'task-list', title:'Task List',loadComponent: () => import('./modules/pages/task-list/component/task-list/task-list.component').then(res=>res.TaskListComponent), canActivate:[authGuard]},

    { path:'configuration', title:'Configuration', loadComponent: () => import('./modules/pages/configuration/component/configuration/configuration.component').then(res => res.ConfigurationComponent), canActivate:[authGuard]},

    {path:'add-deploy', title:'New Deployment', loadComponent: () => import('./modules/pages/task-list/component/add/add.component').then(res => res.AddDeploymentComponent), canActivate:[authGuard]},
];
