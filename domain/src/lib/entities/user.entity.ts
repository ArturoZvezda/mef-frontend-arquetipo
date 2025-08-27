import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';
import { UserAlreadyActiveError, UserSuspendedError } from '../domain-errors/user.errors';

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export class User {
  constructor(
    private readonly id: UserId,
    private readonly email: Email,
    private readonly name: string,
    private status: UserStatus = UserStatus.PENDING,
    private readonly createdAt: Date = new Date()
  ) {}

  getId(): UserId {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getName(): string {
    return this.name;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getStatus(): UserStatus {
    return this.status;
  }

  // Regla de negocio: Activar usuario
  activate(): void {
    if (this.status === UserStatus.ACTIVE) {
      throw new UserAlreadyActiveError(this.id.getValue());
    }
    
    if (this.status === UserStatus.SUSPENDED) {
      throw new UserSuspendedError(this.id.getValue());
    }
    
    this.status = UserStatus.ACTIVE;
  }

  // Regla de negocio: Suspender usuario
  suspend(): void {
    this.status = UserStatus.SUSPENDED;
  }

  // Regla de negocio: Validar si el usuario está activo
  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  equals(other: User): boolean {
    return this.id.equals(other.id);
  }
}