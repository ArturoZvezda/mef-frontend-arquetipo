import { User } from '@mef-frontend-arquetipo/domain';
import { UserRepositoryPort, LoggingPort } from '../../ports';
import { GetUsersQuery, PaginatedUsersDto, UserDto } from '../../dtos';

/**
 * Caso de uso: Obtener lista paginada de usuarios
 */
export class GetUsersUseCase {
  private logger: LoggingPort;

  constructor(
    private userRepository: UserRepositoryPort,
    loggingPort: LoggingPort
  ) {
    this.logger = loggingPort.withContext('GetUsersUseCase');
  }

  /**
   * Ejecuta el caso de uso de obtener usuarios paginados
   * @param query - Parámetros de consulta
   * @returns Promise con la lista paginada de usuarios
   */
  async execute(query: GetUsersQuery): Promise<PaginatedUsersDto> {
    this.logger.info('Getting paginated users', {
      limit: query.limit,
      offset: query.offset,
      searchTerm: query.searchTerm
    });

    try {
      // Validar parámetros
      const limit = Math.min(Math.max(query.limit, 1), 100); // Entre 1 y 100
      const offset = Math.max(query.offset, 0); // Mínimo 0

      // Obtener usuarios del repositorio
      const result = await this.userRepository.findAll(limit, offset);

      // Mapear entidades a DTOs
      const userDtos = result.users.map(user => this.mapToDto(user));

      const paginatedResult: PaginatedUsersDto = {
        users: userDtos,
        total: result.total,
        limit,
        offset,
        hasMore: result.hasMore
      };

      this.logger.debug('Users retrieved successfully', {
        count: userDtos.length,
        total: result.total,
        hasMore: result.hasMore
      });

      return paginatedResult;

    } catch (error) {
      this.logger.error('Failed to get users', error as Error, { query });
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