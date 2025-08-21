import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./users-list/users-list.component').then(c => c.UsersListComponent),
    title: 'Users List'
  },
  {
    path: 'create',
    loadComponent: () => 
      import('./user-form/user-form.component').then(c => c.UserFormComponent),
    title: 'Create User'
  },
  {
    path: ':id',
    loadComponent: () => 
      import('./user-detail/user-detail.component').then(c => c.UserDetailComponent),
    title: 'User Details'
  },
  {
    path: ':id/edit',
    loadComponent: () => 
      import('./user-form/user-form.component').then(c => c.UserFormComponent),
    title: 'Edit User'
  }
];