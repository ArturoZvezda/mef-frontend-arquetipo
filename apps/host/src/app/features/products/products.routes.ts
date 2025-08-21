import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./products-list/products-list.component').then(c => c.ProductsListComponent),
    title: 'Products List'
  },
  {
    path: 'create',
    loadComponent: () => 
      import('./product-form/product-form.component').then(c => c.ProductFormComponent),
    title: 'Create Product'
  },
  {
    path: ':id',
    loadComponent: () => 
      import('./product-detail/product-detail.component').then(c => c.ProductDetailComponent),
    title: 'Product Details'
  },
  {
    path: ':id/edit',
    loadComponent: () => 
      import('./product-form/product-form.component').then(c => c.ProductFormComponent),
    title: 'Edit Product'
  }
];