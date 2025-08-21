import { DomainError } from './base.error';

export class ProductNotFoundError extends DomainError {
  readonly code = 'PRODUCT_NOT_FOUND';
  
  constructor(productId: string) {
    super(`Product with id ${productId} not found`);
  }
}

export class ProductNotAvailableError extends DomainError {
  readonly code = 'PRODUCT_NOT_AVAILABLE';
  
  constructor(message: string) {
    super(message);
  }
}

export class InvalidProductDataError extends DomainError {
  readonly code = 'INVALID_PRODUCT_DATA';
  
  constructor(message: string) {
    super(`Invalid product data: ${message}`);
  }
}