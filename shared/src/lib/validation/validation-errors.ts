/**
 * Tipos y interfaces para manejo de errores de validación
 */

export interface ValidationError {
  code: string;
  message: string;
  field: string;
  value?: any;
  params?: Record<string, any>;
}

export interface FieldValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, ValidationError[]>;
  globalErrors?: ValidationError[];
}

/**
 * Códigos de error estandardizados
 */
export const ValidationErrorCodes = {
  // Requeridos
  REQUIRED: 'required',
  
  // Formato
  EMAIL: 'email',
  PHONE: 'phone',
  DNI: 'dni',
  RUC: 'ruc',
  URL: 'url',
  DATE: 'date',
  
  // Longitud
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  EXACT_LENGTH: 'exactLength',
  
  // Rango numérico
  MIN: 'min',
  MAX: 'max',
  RANGE: 'range',
  
  // Patrones
  PATTERN: 'pattern',
  ALPHANUMERIC: 'alphanumeric',
  ALPHABETIC: 'alphabetic',
  NUMERIC: 'numeric',
  
  // Específicos del dominio MEF
  GOVERNMENT_EMAIL: 'governmentEmail',
  BUDGET_CODE: 'budgetCode',
  SIAF_CODE: 'siafCode',
  
  // Validaciones personalizadas
  CUSTOM: 'custom',
  ASYNC: 'async',
  
  // Comparaciones
  EQUAL_TO: 'equalTo',
  NOT_EQUAL_TO: 'notEqualTo',
  
  // Fechas
  FUTURE_DATE: 'futureDate',
  PAST_DATE: 'pastDate',
  DATE_RANGE: 'dateRange',
  
  // Arrays
  MIN_ITEMS: 'minItems',
  MAX_ITEMS: 'maxItems',
  UNIQUE_ITEMS: 'uniqueItems'
} as const;

export type ValidationErrorCode = typeof ValidationErrorCodes[keyof typeof ValidationErrorCodes];

/**
 * Helper para crear errores de validación
 */
export class ValidationErrorBuilder {
  static required(field: string): ValidationError {
    return {
      code: ValidationErrorCodes.REQUIRED,
      message: 'Este campo es requerido',
      field
    };
  }

  static email(field: string, value: string): ValidationError {
    return {
      code: ValidationErrorCodes.EMAIL,
      message: 'Debe ser un email válido',
      field,
      value
    };
  }

  static minLength(field: string, value: string, minLength: number): ValidationError {
    return {
      code: ValidationErrorCodes.MIN_LENGTH,
      message: `Debe tener al menos ${minLength} caracteres`,
      field,
      value,
      params: { minLength, actualLength: value.length }
    };
  }

  static maxLength(field: string, value: string, maxLength: number): ValidationError {
    return {
      code: ValidationErrorCodes.MAX_LENGTH,
      message: `No debe exceder ${maxLength} caracteres`,
      field,
      value,
      params: { maxLength, actualLength: value.length }
    };
  }

  static pattern(field: string, value: string, pattern: RegExp): ValidationError {
    return {
      code: ValidationErrorCodes.PATTERN,
      message: 'El formato no es válido',
      field,
      value,
      params: { pattern: pattern.toString() }
    };
  }

  static dni(field: string, value: string): ValidationError {
    return {
      code: ValidationErrorCodes.DNI,
      message: 'Debe ser un DNI válido (8 dígitos)',
      field,
      value
    };
  }

  static ruc(field: string, value: string): ValidationError {
    return {
      code: ValidationErrorCodes.RUC,
      message: 'Debe ser un RUC válido (11 dígitos)',
      field,
      value
    };
  }

  static governmentEmail(field: string, value: string): ValidationError {
    return {
      code: ValidationErrorCodes.GOVERNMENT_EMAIL,
      message: 'Debe ser un email del dominio gubernamental (.gob.pe)',
      field,
      value
    };
  }

  static budgetCode(field: string, value: string): ValidationError {
    return {
      code: ValidationErrorCodes.BUDGET_CODE,
      message: 'Debe ser un código presupuestal válido del MEF',
      field,
      value
    };
  }

  static min(field: string, value: number, min: number): ValidationError {
    return {
      code: ValidationErrorCodes.MIN,
      message: `Debe ser mayor o igual a ${min}`,
      field,
      value,
      params: { min }
    };
  }

  static max(field: string, value: number, max: number): ValidationError {
    return {
      code: ValidationErrorCodes.MAX,
      message: `Debe ser menor o igual a ${max}`,
      field,
      value,
      params: { max }
    };
  }

  static futureDate(field: string, value: Date): ValidationError {
    return {
      code: ValidationErrorCodes.FUTURE_DATE,
      message: 'La fecha debe ser futura',
      field,
      value
    };
  }

  static pastDate(field: string, value: Date): ValidationError {
    return {
      code: ValidationErrorCodes.PAST_DATE,
      message: 'La fecha debe ser pasada',
      field,
      value
    };
  }

  static equalTo(field: string, value: any, otherField: string): ValidationError {
    return {
      code: ValidationErrorCodes.EQUAL_TO,
      message: `Debe ser igual al campo ${otherField}`,
      field,
      value,
      params: { otherField }
    };
  }

  static custom(field: string, message: string, value?: any, params?: Record<string, any>): ValidationError {
    return {
      code: ValidationErrorCodes.CUSTOM,
      message,
      field,
      value,
      params
    };
  }
}