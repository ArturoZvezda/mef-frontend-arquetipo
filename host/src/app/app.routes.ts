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
      import('./components/tailwind-dashboard/tailwind-dashboard.component').then(c => c.TailwindDashboardComponent),
    title: 'Dashboard - MEF Frontend Arquetipo'
  },
  {
    path: '**',
    loadComponent: () => 
      import('./components/not-found/not-found.component').then(c => c.NotFoundComponent),
    title: '404 - Not Found'
  }
];