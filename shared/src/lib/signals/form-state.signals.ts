import { Injectable, signal, computed } from '@angular/core';

/**
 * Estado de un campo de formulario
 */
export interface FieldState {
  value: any;
  touched: boolean;
  dirty: boolean;
  errors: string[];
  isValid: boolean;
}

/**
 * Estado de un formulario completo
 */
export interface FormState {
  [fieldName: string]: FieldState;
}

/**
 * Configuración de validación
 */
export interface ValidationConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  custom?: (value: any) => string | null;
}

/**
 * Service para manejo de estado de formularios con Signals
 * Alternativa reactiva a Angular Reactive Forms
 */
@Injectable()
export class FormStateService {
  private formState = signal<FormState>({});
  private formConfig = signal<{ [fieldName: string]: ValidationConfig }>({});
  
  // Estados computados
  readonly isFormValid = computed(() => 
    Object.values(this.formState()).every(field => field.isValid)
  );
  
  readonly isFormDirty = computed(() => 
    Object.values(this.formState()).some(field => field.dirty)
  );
  
  readonly isFormTouched = computed(() => 
    Object.values(this.formState()).some(field => field.touched)
  );
  
  readonly formErrors = computed(() => {
    const errors: { [fieldName: string]: string[] } = {};
    Object.entries(this.formState()).forEach(([fieldName, field]) => {
      if (field.errors.length > 0) {
        errors[fieldName] = field.errors;
      }
    });
    return errors;
  });

  /**
   * Inicializar formulario con configuración
   */
  initForm(config: { [fieldName: string]: ValidationConfig }): void {
    this.formConfig.set(config);
    
    const initialState: FormState = {};
    Object.keys(config).forEach(fieldName => {
      initialState[fieldName] = {
        value: '',
        touched: false,
        dirty: false,
        errors: [],
        isValid: !config[fieldName].required // Si no es requerido, es válido inicialmente
      };
    });
    
    this.formState.set(initialState);
  }

  /**
   * Establecer valor de campo
   */
  setFieldValue(fieldName: string, value: any): void {
    this.formState.update(state => {
      const field = state[fieldName];
      if (!field) return state;

      const errors = this.validateField(fieldName, value);
      
      return {
        ...state,
        [fieldName]: {
          ...field,
          value,
          dirty: true,
          errors,
          isValid: errors.length === 0
        }
      };
    });
  }

  /**
   * Marcar campo como tocado
   */
  setFieldTouched(fieldName: string, touched: boolean = true): void {
    this.formState.update(state => {
      const field = state[fieldName];
      if (!field) return state;

      return {
        ...state,
        [fieldName]: {
          ...field,
          touched
        }
      };
    });
  }

  /**
   * Obtener estado de campo específico
   */
  getFieldState(fieldName: string) {
    return computed(() => this.formState()[fieldName]);
  }

  /**
   * Obtener valor de campo
   */
  getFieldValue(fieldName: string): any {
    return this.formState()[fieldName]?.value;
  }

  /**
   * Obtener todos los valores del formulario
   */
  getFormValues() {
    return computed(() => {
      const values: { [key: string]: any } = {};
      Object.entries(this.formState()).forEach(([fieldName, field]) => {
        values[fieldName] = field.value;
      });
      return values;
    });
  }

  /**
   * Validar campo individual
   */
  private validateField(fieldName: string, value: any): string[] {
    const config = this.formConfig()[fieldName];
    if (!config) return [];

    const errors: string[] = [];

    // Required validation
    if (config.required && (!value || value.toString().trim() === '')) {
      errors.push(`${fieldName} is required`);
      return errors; // Si es requerido y está vacío, no validar más
    }

    // Solo validar el resto si hay valor
    if (value && value.toString().trim() !== '') {
      // MinLength validation
      if (config.minLength && value.toString().length < config.minLength) {
        errors.push(`${fieldName} must be at least ${config.minLength} characters`);
      }

      // MaxLength validation
      if (config.maxLength && value.toString().length > config.maxLength) {
        errors.push(`${fieldName} must be no more than ${config.maxLength} characters`);
      }

      // Pattern validation
      if (config.pattern && !config.pattern.test(value.toString())) {
        errors.push(`${fieldName} format is invalid`);
      }

      // Email validation
      if (config.email && !this.isValidEmail(value.toString())) {
        errors.push(`${fieldName} must be a valid email`);
      }

      // Custom validation
      if (config.custom) {
        const customError = config.custom(value);
        if (customError) {
          errors.push(customError);
        }
      }
    }

    return errors;
  }

  /**
   * Validar email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validar todo el formulario
   */
  validateForm(): boolean {
    let isValid = true;
    
    this.formState.update(state => {
      const newState = { ...state };
      
      Object.keys(newState).forEach(fieldName => {
        const field = newState[fieldName];
        const errors = this.validateField(fieldName, field.value);
        
        newState[fieldName] = {
          ...field,
          touched: true,
          errors,
          isValid: errors.length === 0
        };
        
        if (errors.length > 0) {
          isValid = false;
        }
      });
      
      return newState;
    });
    
    return isValid;
  }

  /**
   * Resetear formulario
   */
  resetForm(): void {
    this.formState.update(state => {
      const newState = { ...state };
      
      Object.keys(newState).forEach(fieldName => {
        newState[fieldName] = {
          value: '',
          touched: false,
          dirty: false,
          errors: [],
          isValid: !this.formConfig()[fieldName]?.required
        };
      });
      
      return newState;
    });
  }

  /**
   * Limpiar errores de campo específico
   */
  clearFieldErrors(fieldName: string): void {
    this.formState.update(state => {
      const field = state[fieldName];
      if (!field) return state;

      return {
        ...state,
        [fieldName]: {
          ...field,
          errors: [],
          isValid: true
        }
      };
    });
  }
}