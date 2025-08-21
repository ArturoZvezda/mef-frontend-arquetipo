import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => 
      import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent),
    title: 'Dashboard - MEF Frontend Arquetipo'
  },
  {
    path: 'users',
    loadChildren: () => 
      import('./features/users/users.routes').then(r => r.usersRoutes),
    title: 'Users'
  },
  {
    path: 'products',
    loadChildren: () => 
      import('./features/products/products.routes').then(r => r.productsRoutes),
    title: 'Products'
  },
  {
    path: '**',
    loadComponent: () => 
      import('./components/not-found/not-found.component').then(c => c.NotFoundComponent),
    title: '404 - Not Found'
  }
];