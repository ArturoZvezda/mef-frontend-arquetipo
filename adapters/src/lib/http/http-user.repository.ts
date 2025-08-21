import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { 
  User, 
  UserId, 
  Email, 
  UserNotFoundError,
  UserAlreadyExistsError 
} from '@mef-frontend-arquetipo/domain';
import { UserRepositoryPort } from '@mef-frontend-arquetipo/application';
import { HttpClientService, PaginatedApiResponse } from './http-client.service';

/**
 * Estructura de datos del usuario en la API
 */
interface UserApiData {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

/**
 * Payload para crear usuario
 */
interface CreateUserPayload {
  email: string;
  name: string;
}

/**
 * Payload para actualizar usuario
 */
interface UpdateUserPayload {
  email?: string;
  name?: string;
}

/**
 * Implementación HTTP del repositorio de usuarios
 * Se conecta con el backend REST API
 */
@Injectable({
  providedIn: 'root'
})
export class HttpUserRepository implements UserRepositoryPort {
  private readonly BASE_ENDPOINT = 'users';

  constructor(private httpClient: HttpClientService) {}

  /**
   * Buscar usuario por ID
   */
  async findById(id: UserId): Promise<User | null> {
    try {
      const userData = await firstValueFrom(
        this.httpClient.get<UserApiData>(`${this.BASE_ENDPOINT}/${id.getValue()}`)
      );
      
      return this.mapToDomain(userData);
    } catch (error: any) {
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Buscar usuario por email
   */
  async findByEmail(email: Email): Promise<User | null> {
    try {
      const response = await firstValueFrom(
        this.httpClient.getPaginated<UserApiData>(`${this.BASE_ENDPOINT}`, {
          email: email.getValue(),
          limit: 1
        })
      );

      if (response.data.length === 0) {
        return null;
      }

      return this.mapToDomain(response.data[0]);
    } catch (error: any) {
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Obtener todos los usuarios con paginación
   */
  async findAll(limit: number, offset: number): Promise<{
    users: User[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await firstValueFrom(
        this.httpClient.getPaginated<UserApiData>(`${this.BASE_ENDPOINT}`, {
          limit,
          offset
        })
      );

      const users = response.data.map(userData => this.mapToDomain(userData));

      return {
        users,
        total: response.pagination.total,
        hasMore: response.pagination.hasMore
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Guardar usuario (crear o actualizar)
   */
  async save(user: User): Promise<User> {
    try {
      // Intentar actualizar primero (buscar por ID)
      const existingUser = await this.findById(user.getId());
      
      if (existingUser) {
        // Usuario existe -> actualizar
        const updatePayload: UpdateUserPayload = {
          email: user.getEmail().getValue(),
          name: user.getName()
        };

        const updatedUserData = await firstValueFrom(
          this.httpClient.put<UserApiData>(
            `${this.BASE_ENDPOINT}/${user.getId().getValue()}`, 
            updatePayload
          )
        );

        return this.mapToDomain(updatedUserData);
      } else {
        // Usuario no existe -> crear
        const createPayload: CreateUserPayload = {
          email: user.getEmail().getValue(),
          name: user.getName()
        };

        const createdUserData = await firstValueFrom(
          this.httpClient.post<UserApiData>(`${this.BASE_ENDPOINT}`, createPayload)
        );

        return this.mapToDomain(createdUserData);
      }
    } catch (error: any) {
      // Manejar errores específicos del dominio
      if (error.message?.includes('already exists') || error.message?.includes('409')) {
        throw new UserAlreadyExistsError(user.getEmail().getValue());
      }
      throw error;
    }
  }

  /**
   * Eliminar usuario por ID
   */
  async deleteById(id: UserId): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpClient.delete(`${this.BASE_ENDPOINT}/${id.getValue()}`)
      );
      return true;
    } catch (error: any) {
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Verificar si existe un usuario con el email dado
   */
  async existsByEmail(email: Email): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  /**
   * Contar total de usuarios en el sistema
   */
  async count(): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.httpClient.getPaginated<UserApiData>(`${this.BASE_ENDPOINT}`, {
          limit: 1,
          offset: 0
        })
      );

      return response.pagination.total;
    } catch (error) {
      console.error('Error counting users:', error);
      throw error;
    }
  }

  /**
   * Mapear datos de la API a entidad de dominio
   */
  private mapToDomain(userData: UserApiData): User {
    return new User(
      UserId.fromString(userData.id),
      Email.fromString(userData.email),
      userData.name,
      new Date(userData.createdAt)
    );
  }
}