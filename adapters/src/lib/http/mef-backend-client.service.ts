import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';

/**
 * Cliente HTTP específico para el backend MEF
 * NO MODIFICA CÓDIGO EXISTENTE - Solo agrega nueva funcionalidad
 */

// Interfaces que mapean exactamente a los DTOs del backend Java
export interface MefUsuarioDto {
  id?: number;
  documento?: string;
  idUsuario?: string;
  nombre?: string;
  apellido?: string;
  segundoApellido?: string;
  correoElectronico?: string;
  activo?: boolean;
}

export interface MefWebResponse<T> {
  result: T;
  success: boolean;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

export interface MefPaginatedResponse<T> {
  totalCount: number;
  items: T[];
}

// Interface que mapea exactamente la respuesta del backend Java
export interface MefBackendPaginatedResponse<T> {
  cantidadTotal: number;
  elementos: T[];
}

@Injectable({
  providedIn: 'root'
})
export class MefBackendClientService {
  private http = inject(HttpClient);
  
  // URL del backend MEF
  private readonly baseUrl = 'http://localhost:8083/v1/siafrp-services/arquetipo';

  /**
   * Obtener usuarios paginados desde el backend MEF
   */
  getUsuariosPaginados(params: {
    document?: string;
    user_name?: string;
    name?: string;
    email_address?: string;
    sorting?: string;
    max_result_count?: number;
    skip_count?: number;
  } = {}): Observable<MefPaginatedResponse<MefUsuarioDto>> {
    
    // Valores por defecto
    const defaultParams = {
      sorting: 'nombre ASC',
      max_result_count: 10,
      skip_count: 0,
      ...params
    };

    return this.http.get<MefWebResponse<MefBackendPaginatedResponse<MefUsuarioDto>>>(
      `${this.baseUrl}/usuarios/paginado`,
      { 
        params: defaultParams,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          // TODO: Agregar Authorization header cuando esté configurada la autenticación
        }
      }
    ).pipe(
      map(response => {
        if (response.success && response.result) {
          // Mapear de la estructura del backend a la esperada por el frontend
          return {
            totalCount: response.result.cantidadTotal,
            items: response.result.elementos
          };
        } else {
          throw new Error(response.error?.message || 'Error desconocido del backend MEF');
        }
      }),
      catchError(error => {
        console.error('Error connecting to MEF backend:', error);
        
        // Retornar datos mock en caso de error de conexión
        return throwError(() => ({
          totalCount: 0,
          items: [],
          error: 'No se pudo conectar al backend MEF. Verifique que esté ejecutándose en http://localhost:8083'
        }));
      })
    );
  }

  /**
   * Crear usuario en el backend MEF
   */
  crearUsuario(usuario: MefUsuarioDto): Observable<MefUsuarioDto> {
    return this.http.post<MefWebResponse<MefUsuarioDto>>(
      `${this.baseUrl}/usuarios`,
      usuario,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      map(response => {
        if (response.success && response.result) {
          return response.result;
        } else {
          throw new Error(response.error?.message || 'Error creando usuario');
        }
      }),
      catchError(error => {
        console.error('Error creating user in MEF backend:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Eliminar usuario en el backend MEF
   */
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/usuarios`,
      { 
        params: { id: id.toString() },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      catchError(error => {
        console.error('Error deleting user in MEF backend:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Verificar conectividad con el backend MEF
   */
  checkConnection(): Observable<boolean> {
    return this.getUsuariosPaginados({ max_result_count: 1 }).pipe(
      map(() => true),
      catchError(() => throwError(() => false))
    );
  }
}