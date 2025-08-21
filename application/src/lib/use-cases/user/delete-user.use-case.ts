import { UserId, UserNotFoundError } from '@mef-frontend-arquetipo/domain';
import { UserRepositoryPort, LoggingPort } from '../../ports';
import { DeleteUserCommand } from '../../dtos';

/**
 * Caso de uso: Eliminar usuario del sistema
 */
export class DeleteUserUseCase {
  private logger: LoggingPort;

  constructor(
    private userRepository: UserRepositoryPort,
    loggingPort: LoggingPort
  ) {
    this.logger = loggingPort.withContext('DeleteUserUseCase');
  }

  /**
   * Ejecuta el caso de uso de eliminación de usuario
   * @param command - Command con el ID del usuario a eliminar
   * @returns Promise que se resuelve cuando el usuario es eliminado
   * @throws UserNotFoundError si el usuario no existe
   */
  async execute(command: DeleteUserCommand): Promise<void> {
    this.logger.info('Starting user deletion process', {
      userId: command.userId
    });

    try {
      const userId = UserId.fromString(command.userId);

      // 1. Verificar que el usuario existe
      const existingUser = await this.userRepository.findById(userId);
      if (!existingUser) {
        this.logger.warn('User not found for deletion', { userId: command.userId });
        throw new UserNotFoundError(command.userId);
      }

      // 2. Eliminar usuario
      const deleted = await this.userRepository.deleteById(userId);
      
      if (!deleted) {
        this.logger.error('Failed to delete user - repository returned false', undefined, {
          userId: command.userId
        });
        throw new Error('Failed to delete user');
      }

      this.logger.info('User deleted successfully', {
        userId: command.userId,
        email: existingUser.getEmail().getValue()
      });

    } catch (error) {
      this.logger.error('Failed to delete user', error as Error, { command });
      throw error;
    }
  }
}