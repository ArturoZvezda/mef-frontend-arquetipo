import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';

export class User {
  constructor(
    private readonly id: UserId,
    private readonly email: Email,
    private readonly name: string,
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

  // Regla de negocio: Validar si el usuario está activo
  isActive(): boolean {
    const daysSinceCreation = Math.floor(
      (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceCreation >= 0; // Usuario activo si fue creado
  }

  equals(other: User): boolean {
    return this.id.equals(other.id);
  }
}