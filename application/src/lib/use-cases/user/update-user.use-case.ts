import { User, UserId, Email, UserNotFoundError, UserAlreadyExistsError } from '@mef-frontend-arquetipo/domain';
import { UserRepositoryPort, LoggingPort } from '../../ports';
import { UpdateUserCommand, UserDto } from '../../dtos';

/**
 * Caso de uso: Actualizar usuario existente
 */
export class UpdateUserUseCase {
  private logger: LoggingPort;

  constructor(
    private userRepository: UserRepositoryPort,
    loggingPort: LoggingPort
  ) {
    this.logger = loggingPort.withContext('UpdateUserUseCase');
  }

  /**
   * Ejecuta el caso de uso de actualización de usuario
   * @param command - Datos de actualización del usuario
   * @returns Promise con el DTO del usuario actualizado
   * @throws UserNotFoundError si el usuario no existe
   * @throws UserAlreadyExistsError si el nuevo email ya existe en otro usuario
   */
  async execute(command: UpdateUserCommand): Promise<UserDto> {
    this.logger.info('Starting user update process', {
      userId: command.userId,
      hasEmailUpdate: !!command.email,
      hasNameUpdate: !!command.name
    });

    try {
      const userId = UserId.fromString(command.userId);

      // 1. Buscar usuario existente
      const existingUser = await this.userRepository.findById(userId);
      if (!existingUser) {
        this.logger.warn('User not found for update', { userId: command.userId });
        throw new UserNotFoundError(command.userId);
      }

      // 2. Si se va a cambiar el email, verificar que no exista
      if (command.email) {
        const newEmail = Email.fromString(command.email);
        const currentEmail = existingUser.getEmail();

        // Solo verificar si el email es diferente al actual
        if (!newEmail.equals(currentEmail)) {
          const userWithEmail = await this.userRepository.findByEmail(newEmail);
          if (userWithEmail && !userWithEmail.getId().equals(userId)) {
            this.logger.warn('Attempt to update user with existing email', {
              userId: command.userId,
              email: command.email
            });
            throw new UserAlreadyExistsError(command.email);
          }
        }
      }

      // 3. Crear usuario actualizado
      const updatedEmail = command.email ? Email.fromString(command.email) : existingUser.getEmail();
      const updatedName = command.name ? command.name.trim() : existingUser.getName();

      const updatedUser = new User(
        existingUser.getId(),
        updatedEmail,
        updatedName,
        existingUser.getCreatedAt()
      );

      // 4. Persistir cambios
      const savedUser = await this.userRepository.save(updatedUser);

      const userDto = this.mapToDto(savedUser);

      this.logger.info('User updated successfully', {
        userId: userDto.id,
        email: userDto.email
      });

      return userDto;

    } catch (error) {
      this.logger.error('Failed to update user', error as Error, { command });
      throw error;
    }
  }

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