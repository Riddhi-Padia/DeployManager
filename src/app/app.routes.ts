import { Routes } from '@angular/router';
import { authGuard } from './common/guards/auth.guard';
import { loginGuard } from './common/guards/login.guard';

export const routes: Routes = [

    { path:'', redirectTo: '/deploy-list', pathMatch:'full'},

    { path: 'login', title:'Login', loadComponent: ()=>  import('./modules/auth/login/login.component').then(res => res.LoginComponent), canActivate:[loginGuard] },

    { path:'deploy-list', title:'Deployment List',loadComponent: () => import('./modules/pages/task-list/component/deploy-list/deploy-list.component').then(res=>res.DeployListComponent), canActivate:[authGuard]},

    { path:'configuration', title:'Configuration', loadComponent: () => import('./modules/pages/configuration/component/configuration/configuration.component').then(res => res.ConfigurationComponent), canActivate:[authGuard]},

    {path:'add-deploy', title:'New Deployment', loadComponent: () => import('./modules/pages/task-list/component/add/add.component').then(res => res.AddDeploymentComponent), canActivate:[authGuard]},
];
