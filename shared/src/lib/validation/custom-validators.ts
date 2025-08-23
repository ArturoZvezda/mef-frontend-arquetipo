/**
 * Validadores personalizados para el dominio del MEF
 */

import { ValidationError, ValidationErrorBuilder } from './validation-errors';

export type ValidatorFunction<T = any> = (value: T, field: string, formData?: Record<string, any>) => ValidationError | null;
export type AsyncValidatorFunction<T = any> = (value: T, field: string, formData?: Record<string, any>) => Promise<ValidationError | null>;

/**
 * Clase base para crear validadores reutilizables
 */
export abstract class BaseValidator<T = any> {
  abstract validate(value: T, field: string, formData?: Record<string, any>): ValidationError | null;
  
  protected isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
  }
}

/**
 * Validadores básicos
 */
export class BasicValidators {
  static required: ValidatorFunction = (value, field) => {
    if (value === null || value === undefined || value === '') {
      return ValidationErrorBuilder.required(field);
    }
    return null;
  };

  static email: ValidatorFunction<string> = (value, field) => {
    if (!value) return null; // Solo validar si tiene valor
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return ValidationErrorBuilder.email(field, value);
    }
    return null;
  };

  static minLength = (length: number): ValidatorFunction<string> => (value, field) => {
    if (!value) return null;
    
    if (value.length < length) {
      return ValidationErrorBuilder.minLength(field, value, length);
    }
    return null;
  };

  static maxLength = (length: number): ValidatorFunction<string> => (value, field) => {
    if (!value) return null;
    
    if (value.length > length) {
      return ValidationErrorBuilder.maxLength(field, value, length);
    }
    return null;
  };

  static pattern = (regex: RegExp): ValidatorFunction<string> => (value, field) => {
    if (!value) return null;
    
    if (!regex.test(value)) {
      return ValidationErrorBuilder.pattern(field, value, regex);
    }
    return null;
  };

  static min = (minValue: number): ValidatorFunction<number> => (value, field) => {
    if (value === null || value === undefined) return null;
    
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < minValue) {
      return ValidationErrorBuilder.min(field, numValue, minValue);
    }
    return null;
  };

  static max = (maxValue: number): ValidatorFunction<number> => (value, field) => {
    if (value === null || value === undefined) return null;
    
    const numValue = Number(value);
    if (isNaN(numValue) || numValue > maxValue) {
      return ValidationErrorBuilder.max(field, numValue, maxValue);
    }
    return null;
  };
}

/**
 * Validadores específicos para documentos peruanos
 */
export class PeruvianDocumentValidators {
  static dni: ValidatorFunction<string> = (value, field) => {
    if (!value) return null;
    
    // DNI debe tener exactamente 8 dígitos
    const dniRegex = /^\d{8}$/;
    if (!dniRegex.test(value)) {
      return ValidationErrorBuilder.dni(field, value);
    }
    
    // Validación adicional: algoritmo de verificación del DNI (opcional)
    // Aquí se podría implementar la validación del dígito verificador
    
    return null;
  };

  static ruc: ValidatorFunction<string> = (value, field) => {
    if (!value) return null;
    
    // RUC debe tener exactamente 11 dígitos
    const rucRegex = /^\d{11}$/;
    if (!rucRegex.test(value)) {
      return ValidationErrorBuilder.ruc(field, value);
    }
    
    // Validación del dígito verificador del RUC
    const factors = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    const digits = value.split('').map(Number);
    const checkDigit = digits[10];
    
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * factors[i];
    }
    
    const remainder = sum % 11;
    const calculatedCheckDigit = remainder < 2 ? remainder : 11 - remainder;
    
    if (checkDigit !== calculatedCheckDigit) {
      return ValidationErrorBuilder.ruc(field, value);
    }
    
    return null;
  };

  static phoneNumber: ValidatorFunction<string> = (value, field) => {
    if (!value) return null;
    
    // Teléfonos peruanos: celular (9 dígitos) o fijo (7-8 dígitos con código de área)
    const phoneRegex = /^(\+51|51)?(\s|-)?[9]\d{8}$|^(\+51|51)?(\s|-)?(\d{1,2})(\s|-)?(\d{6,7})$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return ValidationErrorBuilder.custom(
        field, 
        'Debe ser un número de teléfono peruano válido',
        value
      );
    }
    return null;
  };
}

/**
 * Validadores específicos del MEF
 */
export class MEFValidators {
  static governmentEmail: ValidatorFunction<string> = (value, field) => {
    if (!value) return null;
    
    // Primero validar que sea un email válido
    const emailError = BasicValidators.email(value, field);
    if (emailError) return emailError;
    
    // Luego validar que sea del dominio gubernamental
    const govDomains = ['.gob.pe', '.edu.pe', '.mil.pe'];
    const isGovernmentEmail = govDomains.some(domain => value.toLowerCase().endsWith(domain));
    
    if (!isGovernmentEmail) {
      return ValidationErrorBuilder.governmentEmail(field, value);
    }
    return null;
  };

  static budgetCode: ValidatorFunction<string> = (value, field) => {
    if (!value) return null;
    
    // Código presupuestal MEF: formato específico (ej: 001-001-001)
    const budgetCodeRegex = /^\d{3}-\d{3}-\d{3}$/;
    if (!budgetCodeRegex.test(value)) {
      return ValidationErrorBuilder.budgetCode(field, value);
    }
    return null;
  };

  static siafCode: ValidatorFunction<string> = (value, field) => {
    if (!value) return null;
    
    // Código SIAF: 10 dígitos
    const siafRegex = /^\d{10}$/;
    if (!siafRegex.test(value)) {
      return ValidationErrorBuilder.custom(
        field,
        'Debe ser un código SIAF válido (10 dígitos)',
        value
      );
    }
    return null;
  };

  static fiscalYear: ValidatorFunction<number> = (value, field) => {
    if (!value) return null;
    
    const currentYear = new Date().getFullYear();
    const minYear = 2000;
    const maxYear = currentYear + 5; // Permitir planificación hasta 5 años futuro
    
    if (value < minYear || value > maxYear) {
      return ValidationErrorBuilder.custom(
        field,
        `El año fiscal debe estar entre ${minYear} y ${maxYear}`,
        value,
        { minYear, maxYear }
      );
    }
    return null;
  };

  static budgetAmount: ValidatorFunction<number> = (value, field) => {
    if (!value && value !== 0) return null;
    
    // Montos presupuestales: deben ser positivos y no exceder límites
    const maxBudget = 1000000000; // 1 billón de soles
    
    if (value < 0) {
      return ValidationErrorBuilder.custom(
        field,
        'El monto presupuestal no puede ser negativo',
        value
      );
    }
    
    if (value > maxBudget) {
      return ValidationErrorBuilder.custom(
        field,
        'El monto presupuestal excede el límite máximo',
        value,
        { maxBudget }
      );
    }
    return null;
  };
}

/**
 * Validadores de fecha
 */
export class DateValidators {
  static futureDate: ValidatorFunction<Date | string> = (value, field) => {
    if (!value) return null;
    
    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    
    if (date <= now) {
      return ValidationErrorBuilder.futureDate(field, date);
    }
    return null;
  };

  static pastDate: ValidatorFunction<Date | string> = (value, field) => {
    if (!value) return null;
    
    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    
    if (date >= now) {
      return ValidationErrorBuilder.pastDate(field, date);
    }
    return null;
  };

  static dateRange = (startField: string, endField: string) => {
    return (value: Date | string, field: string, formData?: Record<string, any>): ValidationError | null => {
      if (!value || !formData) return null;
      
      const currentDate = typeof value === 'string' ? new Date(value) : value;
      
      if (field === endField) {
        const startDate = formData[startField];
        if (startDate) {
          const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
          if (currentDate <= start) {
            return ValidationErrorBuilder.custom(
              field,
              'La fecha de fin debe ser posterior a la fecha de inicio',
              value
            );
          }
        }
      }
      
      return null;
    };
  };
}

/**
 * Validadores comparativos
 */
export class ComparisonValidators {
  static equalTo = (otherField: string): ValidatorFunction => (value, field, formData) => {
    if (!formData || !formData[otherField]) return null;
    
    if (value !== formData[otherField]) {
      return ValidationErrorBuilder.equalTo(field, value, otherField);
    }
    return null;
  };

  static notEqualTo = (otherField: string): ValidatorFunction => (value, field, formData) => {
    if (!formData || !formData[otherField]) return null;
    
    if (value === formData[otherField]) {
      return ValidationErrorBuilder.custom(
        field,
        `No debe ser igual al campo ${otherField}`,
        value,
        { otherField }
      );
    }
    return null;
  };
}

/**
 * Validadores asíncronos
 */
export class AsyncValidators {
  static uniqueEmail = (checkFunction: (email: string) => Promise<boolean>): AsyncValidatorFunction<string> => {
    return async (value, field) => {
      if (!value) return null;
      
      try {
        const isUnique = await checkFunction(value);
        if (!isUnique) {
          return ValidationErrorBuilder.custom(
            field,
            'Este email ya está en uso',
            value
          );
        }
        return null;
      } catch (error) {
        return ValidationErrorBuilder.custom(
          field,
          'Error verificando la unicidad del email',
          value
        );
      }
    };
  };

  static uniqueRuc = (checkFunction: (ruc: string) => Promise<boolean>): AsyncValidatorFunction<string> => {
    return async (value, field) => {
      if (!value) return null;
      
      // Primero validar formato
      const formatError = PeruvianDocumentValidators.ruc(value, field);
      if (formatError) return formatError;
      
      try {
        const isUnique = await checkFunction(value);
        if (!isUnique) {
          return ValidationErrorBuilder.custom(
            field,
            'Este RUC ya está registrado',
            value
          );
        }
        return null;
      } catch (error) {
        return ValidationErrorBuilder.custom(
          field,
          'Error verificando el RUC',
          value
        );
      }
    };
  };
}

/**
 * Composición de validadores
 */
export class ValidatorComposer {
  static compose(...validators: ValidatorFunction[]): ValidatorFunction {
    return (value, field, formData) => {
      for (const validator of validators) {
        const error = validator(value, field, formData);
        if (error) return error; // Retornar el primer error encontrado
      }
      return null;
    };
  }

  static composeAsync(...validators: (ValidatorFunction | AsyncValidatorFunction)[]): AsyncValidatorFunction {
    return async (value, field, formData) => {
      for (const validator of validators) {
        const error = await validator(value, field, formData);
        if (error) return error;
      }
      return null;
    };
  }
}