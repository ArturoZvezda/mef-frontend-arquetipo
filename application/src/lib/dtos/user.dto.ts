/**
 * DTO para transferencia de datos de usuario entre capas
 */
export interface UserDto {
  id: string;
  email: string;
  name: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  isActive: boolean;
}

/**
 * DTO para lista paginada de usuarios
 */
export interface PaginatedUsersDto {
  users: UserDto[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/**
 * DTO para datos de entrada de usuario (sin ID, sin fechas)
 */
export interface CreateUserDto {
  email: string;
  name: string;
}

/**
 * DTO para actualización de usuario
 */
export interface UpdateUserDto {
  name?: string;
  email?: string;
}

/**
 * Query parameters para búsqueda de usuarios
 */
export interface UserSearchQuery {
  limit?: number;
  offset?: number;
  email?: string;
  name?: string;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}