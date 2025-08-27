import { User, UserId, UserNotFoundError } from '@mef-frontend-arquetipo/domain';
import { UserRepositoryPort, LoggingPort, EventBusPort, UserActivatedEvent } from '../../ports';
import { ActivateUserCommand, UserDto } from '../../dtos';

/**
 * Caso de uso: Activar un usuario en el sistema
 * 
 * Flujo:
 * 1. Validar que el usuario existe
 * 2. Aplicar regla de negocio de activación
 * 3. Persistir cambios
 * 4. Publicar evento de dominio
 * 5. Retornar DTO actualizado
 */
export class ActivateUserUseCase {
  private logger: LoggingPort;

  constructor(
    private userRepository: UserRepositoryPort,
    private eventBus: EventBusPort,
    loggingPort: LoggingPort
  ) {
    this.logger = loggingPort.withContext('ActivateUserUseCase');
  }

  async execute(command: ActivateUserCommand): Promise<UserDto> {
    this.logger.info('Starting user activation process', {
      userId: command.userId,
      activatedBy: command.activatedBy
    });

    try {
      // 1. Validar entrada y buscar usuario
      const userId = UserId.fromString(command.userId);
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        throw new UserNotFoundError(command.userId);
      }

      this.logger.debug('User found for activation', {
        userId: command.userId,
        currentStatus: user.getStatus()
      });

      // 2. Aplicar regla de negocio
      user.activate(); // 🎯 Aquí está la lógica de dominio

      // 3. Persistir cambios
      const updatedUser = await this.userRepository.save(user);

      // 4. Publicar evento de dominio
      const userActivatedEvent: UserActivatedEvent = {
        type: 'USER_ACTIVATED',
        occurredOn: new Date(),
        aggregateId: updatedUser.getId().getValue(),
        payload: {
          userId: updatedUser.getId().getValue(),
          email: updatedUser.getEmail().getValue(),
          name: updatedUser.getName(),
          activatedBy: command.activatedBy,
          activatedAt: new Date(),
          reason: command.reason
        }
      };

      await this.eventBus.publish(userActivatedEvent);

      // 5. Convertir a DTO y retornar
      const userDto = this.mapToDto(updatedUser);

      this.logger.info('User activated successfully', {
        userId: userDto.id,
        newStatus: userDto.status
      });

      return userDto;

    } catch (error) {
      this.logger.error('Failed to activate user', error as Error, {
        command
      });
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
      updatedAt: new Date().toISOString(), // En producción vendría de la entidad
      isActive: user.isActive()
    };
  }
}