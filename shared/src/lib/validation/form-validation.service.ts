import { Injectable } from '@angular/core';
import { FormControl, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { 
  ValidationError, 
  FormValidationResult, 
  FieldValidationResult 
} from './validation-errors';
import { 
  ValidatorFunction, 
  AsyncValidatorFunction,
  BasicValidators,
  PeruvianDocumentValidators,
  MEFValidators,
  DateValidators,
  ComparisonValidators
} from './custom-validators';

/**
 * Configuración de validación para un campo
 */
export interface FieldValidationConfig {
  validators?: ValidatorFunction[];
  asyncValidators?: AsyncValidatorFunction[];
  debounceTime?: number;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
}

/**
 * Schema de validación para un formulario completo
 */
export interface FormValidationSchema {
  [fieldName: string]: FieldValidationConfig;
}

/**
 * Servicio principal de validación de formularios
 * Integra validadores personalizados con Angular Reactive Forms
 */
@Injectable({
  providedIn: 'root'
})
export class FormValidationService {
  
  // Registro de validadores disponibles
  private readonly validators = {
    basic: BasicValidators,
    documents: PeruvianDocumentValidators,
    mef: MEFValidators,
    dates: DateValidators,
    comparison: ComparisonValidators
  };

  /**
   * Validar un valor individual con validadores personalizados
   */
  validateField(
    value: any, 
    fieldName: string, 
    validators: ValidatorFunction[], 
    formData?: Record<string, any>
  ): FieldValidationResult {
    const errors: ValidationError[] = [];

    for (const validator of validators) {
      const error = validator(value, fieldName, formData);
      if (error) {
        errors.push(error);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validar un valor individual de forma asíncrona
   */
  async validateFieldAsync(
    value: any,
    fieldName: string,
    validators: AsyncValidatorFunction[],
    formData?: Record<string, any>
  ): Promise<FieldValidationResult> {
    const errors: ValidationError[] = [];

    for (const validator of validators) {
      try {
        const error = await validator(value, fieldName, formData);
        if (error) {
          errors.push(error);
        }
      } catch (err) {
        errors.push({
          code: 'async_error',
          message: 'Error en la validación asíncrona',
          field: fieldName,
          value
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validar un formulario completo
   */
  validateForm(formData: Record<string, any>, schema: FormValidationSchema): FormValidationResult {
    const errors: Record<string, ValidationError[]> = {};
    let isValid = true;

    for (const [fieldName, config] of Object.entries(schema)) {
      if (config.validators && config.validators.length > 0) {
        const result = this.validateField(
          formData[fieldName], 
          fieldName, 
          config.validators, 
          formData
        );

        if (!result.isValid) {
          errors[fieldName] = result.errors;
          isValid = false;
        }
      }
    }

    return {
      isValid,
      errors
    };
  }

  /**
   * Crear validador de Angular a partir de validadores personalizados
   */
  createAngularValidator(validators: ValidatorFunction[]): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!validators || validators.length === 0) {
        return null;
      }

      const value = control.value;
      const fieldName = this.getControlName(control);
      const formData = this.getFormData(control);

      const result = this.validateField(value, fieldName, validators, formData);

      if (result.isValid) {
        return null;
      }

      // Convertir errores personalizados a formato Angular
      const angularErrors: ValidationErrors = {};
      result.errors.forEach(error => {
        angularErrors[error.code] = {
          message: error.message,
          actualValue: error.value,
          params: error.params
        };
      });

      return angularErrors;
    };
  }

  /**
   * Crear validador asíncrono de Angular
   */
  createAngularAsyncValidator(
    asyncValidators: AsyncValidatorFunction[]
  ): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!asyncValidators || asyncValidators.length === 0) {
        return of(null);
      }

      const value = control.value;
      const fieldName = this.getControlName(control);
      const formData = this.getFormData(control);

      return from(this.validateFieldAsync(value, fieldName, asyncValidators, formData)).pipe(
        map(result => {
          if (result.isValid) {
            return null;
          }

          const angularErrors: ValidationErrors = {};
          result.errors.forEach(error => {
            angularErrors[error.code] = {
              message: error.message,
              actualValue: error.value,
              params: error.params
            };
          });

          return angularErrors;
        }),
        catchError(() => of({ async_error: { message: 'Error en validación asíncrona' } }))
      );
    };
  }

  /**
   * Configurar un FormGroup con validadores personalizados
   */
  setupFormValidation(form: FormGroup, schema: FormValidationSchema): void {
    for (const [fieldName, config] of Object.entries(schema)) {
      const control = form.get(fieldName);
      if (!control) {
        console.warn(`Campo '${fieldName}' no encontrado en el formulario`);
        continue;
      }

      // Configurar validadores síncronos
      if (config.validators && config.validators.length > 0) {
        const angularValidator = this.createAngularValidator(config.validators);
        control.setValidators([...(control.validator ? [control.validator] : []), angularValidator]);
      }

      // Configurar validadores asíncronos
      if (config.asyncValidators && config.asyncValidators.length > 0) {
        const angularAsyncValidator = this.createAngularAsyncValidator(config.asyncValidators);
        control.setAsyncValidators([
          ...(control.asyncValidator ? [control.asyncValidator] : []), 
          angularAsyncValidator
        ]);
      }

      // Actualizar validadores
      control.updateValueAndValidity();
    }
  }

  /**
   * Obtener mensajes de error amigables para el usuario
   */
  getErrorMessages(control: AbstractControl): string[] {
    if (!control.errors) return [];

    const messages: string[] = [];
    
    for (const [errorCode, errorData] of Object.entries(control.errors)) {
      if (errorData && typeof errorData === 'object' && 'message' in errorData) {
        messages.push(errorData.message as string);
      } else {
        // Fallback para errores sin mensaje personalizado
        messages.push(this.getDefaultErrorMessage(errorCode, errorData));
      }
    }

    return messages;
  }

  /**
   * Verificar si un control específico tiene errores
   */
  hasError(control: AbstractControl, errorCode?: string): boolean {
    if (!control.errors) return false;
    
    if (errorCode) {
      return control.errors[errorCode] !== undefined;
    }
    
    return Object.keys(control.errors).length > 0;
  }

  /**
   * Verificar si un control debe mostrar errores
   */
  shouldShowErrors(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  /**
   * Limpiar todos los errores de un formulario
   */
  clearFormErrors(form: FormGroup): void {
    Object.values(form.controls).forEach(control => {
      control.setErrors(null);
    });
  }

  /**
   * Marcar todos los campos como touched para mostrar errores
   */
  markFormGroupTouched(form: FormGroup): void {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Obtener datos del formulario completo desde un control
   */
  private getFormData(control: AbstractControl): Record<string, any> | undefined {
    let current = control;
    
    // Navegar hacia arriba hasta encontrar el FormGroup raíz
    while (current.parent && !(current.parent instanceof FormGroup)) {
      current = current.parent;
    }
    
    if (current.parent instanceof FormGroup) {
      return current.parent.value;
    }
    
    return undefined;
  }

  /**
   * Obtener el nombre de un control
   */
  private getControlName(control: AbstractControl): string {
    let current = control;
    
    while (current.parent) {
      for (const [name, ctrl] of Object.entries(current.parent.controls)) {
        if (ctrl === current) {
          return name;
        }
      }
      current = current.parent;
    }
    
    return 'unknown';
  }

  /**
   * Mensajes de error por defecto para errores estándar
   */
  private getDefaultErrorMessage(errorCode: string, errorData: any): string {
    const defaultMessages: Record<string, string> = {
      required: 'Este campo es requerido',
      email: 'Debe ser un email válido',
      min: `Debe ser mayor a ${errorData?.min || 0}`,
      max: `Debe ser menor a ${errorData?.max || 999999}`,
      minlength: `Debe tener al menos ${errorData?.requiredLength || 0} caracteres`,
      maxlength: `No debe exceder ${errorData?.requiredLength || 999} caracteres`,
      pattern: 'El formato no es válido'
    };

    return defaultMessages[errorCode] || `Error de validación: ${errorCode}`;
  }

  /**
   * Acceso a validadores predefinidos
   */
  get Validators() {
    return this.validators;
  }
}