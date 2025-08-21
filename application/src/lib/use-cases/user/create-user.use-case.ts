import { User, Email, UserId, UserAlreadyExistsError } from '@mef-frontend-arquetipo/domain';
import { UserRepositoryPort, NotificationPort, LoggingPort, EventBusPort, UserCreatedEvent } from '../../ports';
import { CreateUserCommand, UserDto } from '../../dtos';

/**
 * Caso de uso: Crear un nuevo usuario en el sistema
 * 
 * Flujo:
 * 1. Validar datos de entrada
 * 2. Verificar que el email no exista
 * 3. Crear entidad User
 * 4. Persistir en repositorio
 * 5. Publicar evento de dominio
 * 6. Enviar notificación de bienvenida
 * 7. Retornar DTO del usuario creado
 */
export class CreateUserUseCase {
  private logger: LoggingPort;

  constructor(
    private userRepository: UserRepositoryPort,
    private notification: NotificationPort,
    private eventBus: EventBusPort,
    loggingPort: LoggingPort
  ) {
    this.logger = loggingPort.withContext('CreateUserUseCase');
  }

  /**
   * Ejecuta el caso de uso de creación de usuario
   * @param command - Datos del usuario a crear
   * @returns Promise con el DTO del usuario creado
   * @throws UserAlreadyExistsError si el email ya existe
   * @throws Error si hay problemas de validación o persistencia
   */
  async execute(command: CreateUserCommand): Promise<UserDto> {
    this.logger.info('Starting user creation process', {
      email: command.email,
      name: command.name
    });

    try {
      // 1. Validar y crear value objects
      const email = Email.fromString(command.email);
      const userId = UserId.generate();

      // 2. Verificar que el usuario no exista
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        this.logger.warn('Attempt to create user with existing email', {
          email: command.email
        });
        throw new UserAlreadyExistsError(command.email);
      }

      // 3. Crear entidad de dominio
      const user = new User(userId, email, command.name.trim());

      this.logger.debug('User entity created', {
        userId: userId.getValue(),
        email: email.getValue()
      });

      // 4. Persistir usuario
      const savedUser = await this.userRepository.save(user);

      // 5. Publicar evento de dominio
      const userCreatedEvent: UserCreatedEvent = {
        type: 'USER_CREATED',
        occurredOn: new Date(),
        aggregateId: savedUser.getId().getValue(),
        payload: {
          userId: savedUser.getId().getValue(),
          email: savedUser.getEmail().getValue(),
          name: savedUser.getName()
        }
      };

      await this.eventBus.publish(userCreatedEvent);

      // 6. Enviar notificación de bienvenida (no bloqueante)
      this.notification.sendWelcomeEmail(savedUser).catch(error => {
        this.logger.error('Failed to send welcome email', error, {
          userId: savedUser.getId().getValue()
        });
      });

      // 7. Convertir a DTO y retornar
      const userDto: UserDto = this.mapToDto(savedUser);

      this.logger.info('User created successfully', {
        userId: userDto.id,
        email: userDto.email
      });

      return userDto;

    } catch (error) {
      this.logger.error('Failed to create user', error as Error, {
        command
      });
      throw error;
    }
  }

  /**
   * Mapea una entidad User a UserDto
   */
  private mapToDto(user: User): UserDto {
    return {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      name: user.getName(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getCreatedAt().toISOString(),
      isActive: user.isActive()
    };
  }
}