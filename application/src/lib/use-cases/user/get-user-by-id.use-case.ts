import { User, UserId, UserNotFoundError } from '@mef-frontend-arquetipo/domain';
import { UserRepositoryPort, LoggingPort } from '../../ports';
import { GetUserByIdQuery, UserDto } from '../../dtos';

/**
 * Caso de uso: Obtener usuario por ID
 */
export class GetUserByIdUseCase {
  private logger: LoggingPort;

  constructor(
    private userRepository: UserRepositoryPort,
    loggingPort: LoggingPort
  ) {
    this.logger = loggingPort.withContext('GetUserByIdUseCase');
  }

  /**
   * Ejecuta el caso de uso de obtener usuario por ID
   * @param query - Query con el ID del usuario
   * @returns Promise con el DTO del usuario encontrado
   * @throws UserNotFoundError si el usuario no existe
   */
  async execute(query: GetUserByIdQuery): Promise<UserDto> {
    this.logger.info('Getting user by ID', { userId: query.userId });

    try {
      const userId = UserId.fromString(query.userId);
      const user = await this.userRepository.findById(userId);

      if (!user) {
        this.logger.warn('User not found', { userId: query.userId });
        throw new UserNotFoundError(query.userId);
      }

      const userDto = this.mapToDto(user);
      
      this.logger.debug('User retrieved successfully', {
        userId: userDto.id,
        email: userDto.email
      });

      return userDto;

    } catch (error) {
      this.logger.error('Failed to get user by ID', error as Error, { query });
      throw error;
    }
  }

  private mapToDto(user: User): UserDto {
    return {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      name: user.getName(),
      status: user.getStatus(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getCreatedAt().toISOString(),
      isActive: user.isActive()
    };
  }
}