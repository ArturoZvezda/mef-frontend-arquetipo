import { DomainError } from './base.error';

export class UserNotFoundError extends DomainError {
  readonly code = 'USER_NOT_FOUND';
  
  constructor(userId: string) {
    super(`User with id ${userId} not found`);
  }
}

export class UserAlreadyExistsError extends DomainError {
  readonly code = 'USER_ALREADY_EXISTS';
  
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}

export class InvalidUserDataError extends DomainError {
  readonly code = 'INVALID_USER_DATA';
  
  constructor(message: string) {
    super(`Invalid user data: ${message}`);
  }
}