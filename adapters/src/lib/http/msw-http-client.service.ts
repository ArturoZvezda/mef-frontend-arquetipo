import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, catchError, map } from 'rxjs';

/**
 * Cliente HTTP optimizado para trabajar con MSW
 * Proporciona métodos consistentes para todas las llamadas HTTP
 */
@Injectable({
  providedIn: 'root'
})
export class MswHttpClientService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * GET request con manejo de errores y logging
   */
  get<T>(endpoint: string, params?: Record<string, any>): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    let httpParams = new HttpParams();

    // Convertir params objeto a HttpParams
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    console.log(`🌐 GET ${url}`, params);

    return this.http.get<any>(url, { params: httpParams }).pipe(
      map(response => {
        console.log(`✅ GET ${url}`, response);
        return response.data || response;
      }),
      catchError(error => this.handleError('GET', url, error))
    );
  }

  /**
   * POST request con payload
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log(`🌐 POST ${url}`, data);

    return this.http.post<any>(url, data).pipe(
      map(response => {
        console.log(`✅ POST ${url}`, response);
        return response.data || response;
      }),
      catchError(error => this.handleError('POST', url, error))
    );
  }

  /**
   * PUT request para actualizaciones completas
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log(`🌐 PUT ${url}`, data);

    return this.http.put<any>(url, data).pipe(
      map(response => {
        console.log(`✅ PUT ${url}`, response);
        return response.data || response;
      }),
      catchError(error => this.handleError('PUT', url, error))
    );
  }

  /**
   * PATCH request para actualizaciones parciales
   */
  patch<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log(`🌐 PATCH ${url}`, data);

    return this.http.patch<any>(url, data).pipe(
      map(response => {
        console.log(`✅ PATCH ${url}`, response);
        return response.data || response;
      }),
      catchError(error => this.handleError('PATCH', url, error))
    );
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log(`🌐 DELETE ${url}`);

    return this.http.delete<any>(url).pipe(
      map(response => {
        console.log(`✅ DELETE ${url}`, response);
        return response.data || response;
      }),
      catchError(error => this.handleError('DELETE', url, error))
    );
  }

  /**
   * Manejo centralizado de errores HTTP
   */
  private handleError(method: string, url: string, error: HttpErrorResponse): Observable<never> {
    console.error(`❌ ${method} ${url}`, {
      status: error.status,
      statusText: error.statusText,
      message: error.error?.message || error.message,
      code: error.error?.code,
      details: error.error?.details
    });

    // Estructurar error para el dominio
    const domainError = {
      method,
      url,
      status: error.status,
      statusText: error.statusText,
      message: error.error?.message || error.message || 'Error desconocido',
      code: error.error?.code || 'UNKNOWN_ERROR',
      details: error.error?.details,
      timestamp: new Date()
    };

    return throwError(() => domainError);
  }

  /**
   * Helpers específicos para endpoints comunes
   */

  // Users
  getUsers(filters?: { page?: number; limit?: number; search?: string; role?: string }) {
    return this.get('/users', filters);
  }

  getUserById(id: string) {
    return this.get(`/users/${id}`);
  }

  createUser(userData: any) {
    return this.post('/users', userData);
  }

  updateUser(id: string, userData: any) {
    return this.put(`/users/${id}`, userData);
  }

  deleteUser(id: string) {
    return this.delete(`/users/${id}`);
  }

  activateUser(id: string, isActive: boolean) {
    return this.patch(`/users/${id}/activate`, { isActive });
  }

  // Products
  getProducts(filters?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }) {
    return this.get('/products', filters);
  }

  getProductById(id: string) {
    return this.get(`/products/${id}`);
  }

  createProduct(productData: any) {
    return this.post('/products', productData);
  }

  reserveProduct(id: string, quantity: number, userId: string) {
    return this.post(`/products/${id}/reserve`, { quantity, userId });
  }

  getProductCategories() {
    return this.get('/products/categories');
  }

  getProductStats() {
    return this.get('/products/stats');
  }

  // Auth
  login(email: string, password: string) {
    return this.post('/auth/login', { email, password });
  }

  refreshToken() {
    return this.post('/auth/refresh', {});
  }

  getCurrentUser() {
    return this.get('/auth/me');
  }

  logout() {
    return this.post('/auth/logout', {});
  }

  forgotPassword(email: string) {
    return this.post('/auth/forgot-password', { email });
  }

  getPermissions() {
    return this.get('/auth/permissions');
  }
}