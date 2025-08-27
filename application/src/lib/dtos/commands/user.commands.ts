/**
 * Command para crear un nuevo usuario
 */
export interface CreateUserCommand {
  email: string;
  name: string;
}

/**
 * Command para actualizar un usuario existente
 */
export interface UpdateUserCommand {
  userId: string;
  name?: string;
  email?: string;
}

/**
 * Command para eliminar un usuario
 */
export interface DeleteUserCommand {
  userId: string;
}

/**
 * Command para activar un usuario
 */
export interface ActivateUserCommand {
  userId: string;
  activatedBy: string;
  reason?: string;
}

/**
 * Query para obtener usuario por ID
 */
export interface GetUserByIdQuery {
  userId: string;
}

/**
 * Query para obtener usuario por email
 */
export interface GetUserByEmailQuery {
  email: string;
}

/**
 * Query para obtener lista de usuarios con paginación
 */
export interface GetUsersQuery {
  limit: number;
  offset: number;
  searchTerm?: string;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}