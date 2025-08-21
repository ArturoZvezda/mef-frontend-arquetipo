import { User, UserId, Email } from '@mef-frontend-arquetipo/domain';

/**
 * Puerto para repositorio de usuarios - Define el contrato para persistencia
 * Implementado por adapters en la capa de infraestructura
 */
export interface UserRepositoryPort {
  /**
   * Buscar usuario por ID
   * @param id - Identificador único del usuario
   * @returns Usuario encontrado o null si no existe
   */
  findById(id: UserId): Promise<User | null>;

  /**
   * Buscar usuario por email
   * @param email - Email del usuario
   * @returns Usuario encontrado o null si no existe
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Obtener todos los usuarios con paginación
   * @param limit - Número máximo de usuarios a retornar
   * @param offset - Número de usuarios a saltar
   * @returns Lista paginada de usuarios
   */
  findAll(limit: number, offset: number): Promise<{
    users: User[];
    total: number;
    hasMore: boolean;
  }>;

  /**
   * Guardar usuario (crear o actualizar)
   * @param user - Usuario a guardar
   * @returns Usuario guardado
   */
  save(user: User): Promise<User>;

  /**
   * Eliminar usuario por ID
   * @param id - Identificador del usuario a eliminar
   * @returns true si se eliminó, false si no existía
   */
  deleteById(id: UserId): Promise<boolean>;

  /**
   * Verificar si existe un usuario con el email dado
   * @param email - Email a verificar
   * @returns true si existe, false si no
   */
  existsByEmail(email: Email): Promise<boolean>;

  /**
   * Contar total de usuarios en el sistema
   * @returns Número total de usuarios
   */
  count(): Promise<number>;
}