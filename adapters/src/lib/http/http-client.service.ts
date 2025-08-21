import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Configuración del cliente HTTP
 */
export interface HttpConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

/**
 * Respuesta de la API con metadatos
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

/**
 * Respuesta paginada de la API
 */
export interface PaginatedApiResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  success: boolean;
  timestamp: string;
}

/**
 * Servicio HTTP centralizado para comunicación con el backend
 * Maneja autenticación, headers, errores y transformaciones
 */
@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private config: HttpConfig = {
    baseUrl: 'http://localhost:3000/api', // URL del backend
    timeout: 30000,
    defaultHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  constructor(private http: HttpClient) {}

  /**
   * Configurar el cliente HTTP
   */
  configure(config: Partial<HttpConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * GET request genérico
   */
  get<T>(endpoint: string, params?: Record<string, any>): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpParams = this.buildParams(params);
    const headers = this.buildHeaders();

    return this.http.get<ApiResponse<T>>(url, { 
      headers, 
      params: httpParams 
    }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * GET request para listas paginadas
   */
  getPaginated<T>(endpoint: string, params?: Record<string, any>): Observable<PaginatedApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const httpParams = this.buildParams(params);
    const headers = this.buildHeaders();

    return this.http.get<PaginatedApiResponse<T>>(url, { 
      headers, 
      params: httpParams 
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * POST request genérico
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders();

    return this.http.post<ApiResponse<T>>(url, body, { headers }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * PUT request genérico
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders();

    return this.http.put<ApiResponse<T>>(url, body, { headers }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * DELETE request genérico
   */
  delete<T>(endpoint: string): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders();

    return this.http.delete<ApiResponse<T>>(url, { headers }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Construir URL completa
   */
  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const cleanBaseUrl = this.config.baseUrl.endsWith('/') 
      ? this.config.baseUrl.slice(0, -1) 
      : this.config.baseUrl;
    
    return `${cleanBaseUrl}/${cleanEndpoint}`;
  }

  /**
   * Construir headers HTTP
   */
  private buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders(this.config.defaultHeaders);

    // Agregar token de autenticación si existe
    const token = this.getAuthToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Construir parámetros HTTP
   */
  private buildParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return httpParams;
  }

  /**
   * Obtener token de autenticación
   */
  private getAuthToken(): string | null {
    // TODO: Implementar según tu sistema de autenticación
    return localStorage.getItem('auth_token');
  }

  /**
   * Manejo centralizado de errores HTTP
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Bad Request';
          break;
        case 401:
          errorMessage = 'Unauthorized access';
          // TODO: Redirigir a login
          break;
        case 403:
          errorMessage = 'Access forbidden';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflict occurred';
          break;
        case 422:
          errorMessage = error.error?.message || 'Validation failed';
          break;
        case 500:
          errorMessage = 'Internal server error';
          break;
        default:
          errorMessage = `Server Error: ${error.status} ${error.statusText}`;
      }
    }

    console.error('HTTP Error:', {
      status: error.status,
      message: errorMessage,
      error: error.error,
      url: error.url
    });

    return throwError(() => new Error(errorMessage));
  };
}