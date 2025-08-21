import { Injectable } from '@angular/core';
import { User, UserId, Email } from '@mef-frontend-arquetipo/domain';
import { UserRepositoryPort } from '@mef-frontend-arquetipo/application';
import { StorageService } from './storage.service';

/**
 * Datos de usuario para localStorage
 */
interface UserStorageData {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

/**
 * Implementación de repositorio de usuarios usando localStorage
 * Útil para desarrollo, testing y funcionalidad offline
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageUserRepository implements UserRepositoryPort {
  private readonly STORAGE_KEY = 'mef_users';
  private readonly COUNTER_KEY = 'mef_users_counter';

  constructor(private storage: StorageService) {}

  async findById(id: UserId): Promise<User | null> {
    const users = this.getAllUsers();
    const userData = users.find(u => u.id === id.getValue());
    return userData ? this.mapToDomain(userData) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const users = this.getAllUsers();
    const userData = users.find(u => u.email === email.getValue());
    return userData ? this.mapToDomain(userData) : null;
  }

  async findAll(limit: number, offset: number): Promise<{
    users: User[];
    total: number;
    hasMore: boolean;
  }> {
    const allUsers = this.getAllUsers();
    const total = allUsers.length;
    
    // Aplicar paginación
    const paginatedUsers = allUsers.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      users: paginatedUsers.map(userData => this.mapToDomain(userData)),
      total,
      hasMore
    };
  }

  async save(user: User): Promise<User> {
    const users = this.getAllUsers();
    const existingIndex = users.findIndex(u => u.id === user.getId().getValue());

    const userData: UserStorageData = {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      name: user.getName(),
      createdAt: user.getCreatedAt().toISOString()
    };

    if (existingIndex >= 0) {
      // Actualizar usuario existente
      users[existingIndex] = userData;
    } else {
      // Agregar nuevo usuario
      users.push(userData);
    }

    this.saveAllUsers(users);
    return user;
  }

  async deleteById(id: UserId): Promise<boolean> {
    const users = this.getAllUsers();
    const initialLength = users.length;
    const filteredUsers = users.filter(u => u.id !== id.getValue());

    if (filteredUsers.length === initialLength) {
      return false; // Usuario no encontrado
    }

    this.saveAllUsers(filteredUsers);
    return true;
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  async count(): Promise<number> {
    return this.getAllUsers().length;
  }

  /**
   * Obtener todos los usuarios del localStorage
   */
  private getAllUsers(): UserStorageData[] {
    return this.storage.getItem<UserStorageData[]>(this.STORAGE_KEY) || [];
  }

  /**
   * Guardar todos los usuarios en localStorage
   */
  private saveAllUsers(users: UserStorageData[]): void {
    this.storage.setItem(this.STORAGE_KEY, users);
  }

  /**
   * Mapear datos de storage a entidad de dominio
   */
  private mapToDomain(userData: UserStorageData): User {
    return new User(
      UserId.fromString(userData.id),
      Email.fromString(userData.email),
      userData.name,
      new Date(userData.createdAt)
    );
  }

  /**
   * Limpiar todos los datos (útil para testing)
   */
  clear(): void {
    this.storage.removeItem(this.STORAGE_KEY);
    this.storage.removeItem(this.COUNTER_KEY);
  }

  /**
   * Poblar con datos de prueba
   */
  seedWithTestData(): void {
    const testUsers: UserStorageData[] = [
      {
        id: '1',
        email: 'admin@mef.com',
        name: 'Administrator',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'user@mef.com',
        name: 'Test User',
        createdAt: new Date().toISOString()
      }
    ];

    this.saveAllUsers(testUsers);
  }
}