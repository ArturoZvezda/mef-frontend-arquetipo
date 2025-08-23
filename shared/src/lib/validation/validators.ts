/**
 * Validadores predefinidos listos para usar
 * Combinaciones comunes de validadores para diferentes tipos de campos
 */

import { 
  BasicValidators,
  PeruvianDocumentValidators,
  MEFValidators,
  DateValidators,
  ComparisonValidators,
  ValidatorComposer
} from './custom-validators';

/**
 * Validadores comunes para campos de usuario
 */
export const UserFieldValidators = {
  // Nombres y texto
  name: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.minLength(2),
    BasicValidators.maxLength(100),
    BasicValidators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) // Solo letras y espacios
  ),

  firstName: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.minLength(2),
    BasicValidators.maxLength(50),
    BasicValidators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)
  ),

  lastName: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.minLength(2),
    BasicValidators.maxLength(50),
    BasicValidators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)
  ),

  // Documentos de identidad
  dni: ValidatorComposer.compose(
    BasicValidators.required,
    PeruvianDocumentValidators.dni
  ),

  ruc: ValidatorComposer.compose(
    BasicValidators.required,
    PeruvianDocumentValidators.ruc
  ),

  // Contacto
  email: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.email,
    BasicValidators.maxLength(255)
  ),

  governmentEmail: ValidatorComposer.compose(
    BasicValidators.required,
    MEFValidators.governmentEmail,
    BasicValidators.maxLength(255)
  ),

  phone: ValidatorComposer.compose(
    PeruvianDocumentValidators.phoneNumber
  ),

  // Campos opcionales
  optionalName: ValidatorComposer.compose(
    BasicValidators.minLength(2),
    BasicValidators.maxLength(100)
  ),

  optionalEmail: ValidatorComposer.compose(
    BasicValidators.email,
    BasicValidators.maxLength(255)
  )
};

/**
 * Validadores para campos del MEF
 */
export const MEFFieldValidators = {
  // Códigos presupuestales
  budgetCode: ValidatorComposer.compose(
    BasicValidators.required,
    MEFValidators.budgetCode
  ),

  siafCode: ValidatorComposer.compose(
    BasicValidators.required,
    MEFValidators.siafCode
  ),

  // Años fiscales
  fiscalYear: ValidatorComposer.compose(
    BasicValidators.required,
    MEFValidators.fiscalYear
  ),

  // Montos presupuestales
  budgetAmount: ValidatorComposer.compose(
    BasicValidators.required,
    MEFValidators.budgetAmount
  ),

  optionalBudgetAmount: ValidatorComposer.compose(
    MEFValidators.budgetAmount
  ),

  // Descripción de proyecto
  projectDescription: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.minLength(10),
    BasicValidators.maxLength(1000)
  ),

  // Códigos de unidad ejecutora
  executingUnit: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.pattern(/^\d{4}$/) // 4 dígitos
  ),

  // Meta presupuestal
  budgetGoal: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.pattern(/^\d{4}$/) // 4 dígitos
  )
};

/**
 * Validadores para fechas
 */
export const DateFieldValidators = {
  // Fechas requeridas
  requiredDate: ValidatorComposer.compose(
    BasicValidators.required
  ),

  // Fechas futuras
  futureDate: ValidatorComposer.compose(
    BasicValidators.required,
    DateValidators.futureDate
  ),

  // Fechas pasadas
  pastDate: ValidatorComposer.compose(
    BasicValidators.required,
    DateValidators.pastDate
  ),

  // Fecha de inicio (debe ser futura)
  startDate: ValidatorComposer.compose(
    BasicValidators.required,
    DateValidators.futureDate
  ),

  // Fecha de fin (se valida con dateRange)
  endDate: ValidatorComposer.compose(
    BasicValidators.required,
    DateValidators.dateRange('startDate', 'endDate')
  ),

  // Fechas opcionales
  optionalDate: [],

  optionalFutureDate: ValidatorComposer.compose(
    DateValidators.futureDate
  )
};

/**
 * Validadores para formularios de autenticación
 */
export const AuthFieldValidators = {
  username: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.minLength(3),
    BasicValidators.maxLength(50),
    BasicValidators.pattern(/^[a-zA-Z0-9._-]+$/)
  ),

  password: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.minLength(8),
    BasicValidators.maxLength(128),
    BasicValidators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/) // Al menos: minúscula, mayúscula, número, carácter especial
  ),

  confirmPassword: ComparisonValidators.equalTo('password'),

  currentPassword: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.minLength(1)
  )
};

/**
 * Validadores para formularios de productos/servicios
 */
export const ProductFieldValidators = {
  productName: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.minLength(3),
    BasicValidators.maxLength(200)
  ),

  productDescription: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.minLength(10),
    BasicValidators.maxLength(2000)
  ),

  productPrice: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.min(0.01),
    BasicValidators.max(999999999)
  ),

  productStock: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.min(0),
    BasicValidators.max(999999)
  ),

  productCategory: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.minLength(2),
    BasicValidators.maxLength(50)
  ),

  productSKU: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.pattern(/^[A-Z0-9-]+$/),
    BasicValidators.minLength(3),
    BasicValidators.maxLength(20)
  ),

  quantity: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.min(1),
    BasicValidators.max(1000)
  )
};

/**
 * Validadores para archivos
 */
export const FileFieldValidators = {
  // Tamaño máximo de archivo (en bytes)
  maxFileSize: (maxSizeInMB: number) => (value: File, field: string) => {
    if (!value) return null;
    
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (value.size > maxSizeInBytes) {
      return {
        code: 'file_too_large',
        message: `El archivo no debe exceder ${maxSizeInMB}MB`,
        field,
        value: value.name,
        params: { maxSize: maxSizeInMB, actualSize: Math.round(value.size / 1024 / 1024 * 100) / 100 }
      };
    }
    return null;
  },

  // Tipos de archivo permitidos
  allowedFileTypes: (allowedTypes: string[]) => (value: File, field: string) => {
    if (!value) return null;
    
    const fileExtension = value.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return {
        code: 'invalid_file_type',
        message: `Solo se permiten archivos: ${allowedTypes.join(', ')}`,
        field,
        value: value.name,
        params: { allowedTypes, actualType: fileExtension }
      };
    }
    return null;
  },

  // Archivo requerido
  requiredFile: (value: File | null, field: string) => {
    if (!value) {
      return {
        code: 'required',
        message: 'Debe seleccionar un archivo',
        field,
        value: null
      };
    }
    return null;
  }
};

/**
 * Validadores para campos de dirección
 */
export const AddressFieldValidators = {
  street: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.minLength(5),
    BasicValidators.maxLength(200)
  ),

  district: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.minLength(2),
    BasicValidators.maxLength(100)
  ),

  province: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.minLength(2),
    BasicValidators.maxLength(100)
  ),

  department: ValidatorComposer.compose(
    BasicValidators.required,
    BasicValidators.minLength(2),
    BasicValidators.maxLength(100)
  ),

  postalCode: ValidatorComposer.compose(
    BasicValidators.pattern(/^\d{5}$/), // Código postal peruano
    BasicValidators.minLength(5),
    BasicValidators.maxLength(5)
  ),

  reference: ValidatorComposer.compose(
    BasicValidators.maxLength(300)
  )
};

/**
 * Validadores dinámicos para casos especiales
 */
export const DynamicValidators = {
  // Validar que al menos uno de varios campos esté lleno
  atLeastOneRequired: (fields: string[], message: string = 'Al menos un campo es requerido') => {
    return (value: any, field: string, formData?: Record<string, any>) => {
      if (!formData) return null;
      
      const hasValue = fields.some(fieldName => {
        const fieldValue = formData[fieldName];
        return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
      });
      
      if (!hasValue) {
        return {
          code: 'at_least_one_required',
          message,
          field,
          value,
          params: { fields }
        };
      }
      return null;
    };
  },

  // Validar que los campos sean mutuamente exclusivos
  mutuallyExclusive: (otherField: string, message: string = 'Los campos son mutuamente exclusivos') => {
    return (value: any, field: string, formData?: Record<string, any>) => {
      if (!value || !formData || !formData[otherField]) return null;
      
      return {
        code: 'mutually_exclusive',
        message,
        field,
        value,
        params: { otherField }
      };
    };
  },

  // Validar suma de campos
  sumEquals: (otherFields: string[], expectedSum: number) => {
    return (value: any, field: string, formData?: Record<string, any>) => {
      if (!formData) return null;
      
      const sum = otherFields.reduce((acc, fieldName) => {
        const fieldValue = parseFloat(formData[fieldName]) || 0;
        return acc + fieldValue;
      }, parseFloat(value) || 0);
      
      if (Math.abs(sum - expectedSum) > 0.01) { // Tolerancia para decimales
        return {
          code: 'sum_mismatch',
          message: `La suma debe ser ${expectedSum}`,
          field,
          value,
          params: { expectedSum, actualSum: sum }
        };
      }
      return null;
    };
  }
};

/**
 * Presets de validación para formularios completos
 */
export const FormValidationPresets = {
  // Registro de usuario básico
  userRegistration: {
    firstName: { validators: [UserFieldValidators.firstName] },
    lastName: { validators: [UserFieldValidators.lastName] },
    email: { validators: [UserFieldValidators.email] },
    password: { validators: [AuthFieldValidators.password] },
    confirmPassword: { validators: [AuthFieldValidators.confirmPassword] },
    phone: { validators: [UserFieldValidators.phone] },
    dni: { validators: [UserFieldValidators.dni] }
  },

  // Registro de funcionario público
  publicOfficialRegistration: {
    firstName: { validators: [UserFieldValidators.firstName] },
    lastName: { validators: [UserFieldValidators.lastName] },
    email: { validators: [UserFieldValidators.governmentEmail] },
    dni: { validators: [UserFieldValidators.dni] },
    phone: { validators: [UserFieldValidators.phone] },
    executingUnit: { validators: [MEFFieldValidators.executingUnit] }
  },

  // Creación de proyecto presupuestal
  budgetProjectCreation: {
    projectName: { validators: [UserFieldValidators.name] },
    projectDescription: { validators: [MEFFieldValidators.projectDescription] },
    budgetCode: { validators: [MEFFieldValidators.budgetCode] },
    fiscalYear: { validators: [MEFFieldValidators.fiscalYear] },
    budgetAmount: { validators: [MEFFieldValidators.budgetAmount] },
    startDate: { validators: [DateFieldValidators.startDate] },
    endDate: { validators: [DateFieldValidators.endDate] },
    executingUnit: { validators: [MEFFieldValidators.executingUnit] }
  },

  // Login
  login: {
    email: { validators: [UserFieldValidators.email] },
    password: { validators: [AuthFieldValidators.currentPassword] }
  },

  // Cambio de contraseña
  changePassword: {
    currentPassword: { validators: [AuthFieldValidators.currentPassword] },
    newPassword: { validators: [AuthFieldValidators.password] },
    confirmNewPassword: { validators: [ComparisonValidators.equalTo('newPassword')] }
  }
};

// Export por defecto con todos los validadores organizados
export default {
  User: UserFieldValidators,
  MEF: MEFFieldValidators,
  Date: DateFieldValidators,
  Auth: AuthFieldValidators,
  Product: ProductFieldValidators,
  File: FileFieldValidators,
  Address: AddressFieldValidators,
  Dynamic: DynamicValidators,
  Presets: FormValidationPresets
};