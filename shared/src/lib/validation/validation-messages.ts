/**
 * Mensajes de validación personalizables e internacionalizables
 */

export interface ValidationMessageConfig {
  [key: string]: string | ((params?: any) => string);
}

/**
 * Mensajes en español para validaciones
 */
export const ValidationMessagesES: ValidationMessageConfig = {
  // Mensajes básicos
  required: 'Este campo es requerido',
  email: 'Debe ser un email válido',
  minLength: (params: { minLength: number; actualLength: number }) => 
    `Debe tener al menos ${params.minLength} caracteres (actual: ${params.actualLength})`,
  maxLength: (params: { maxLength: number; actualLength: number }) => 
    `No debe exceder ${params.maxLength} caracteres (actual: ${params.actualLength})`,
  min: (params: { min: number }) => `Debe ser mayor o igual a ${params.min}`,
  max: (params: { max: number }) => `Debe ser menor o igual a ${params.max}`,
  pattern: 'El formato no es válido',

  // Documentos peruanos
  dni: 'Debe ser un DNI válido (8 dígitos)',
  ruc: 'Debe ser un RUC válido (11 dígitos)',
  phone: 'Debe ser un número de teléfono peruano válido',

  // Campos específicos del MEF
  governmentEmail: 'Debe ser un email del dominio gubernamental (.gob.pe)',
  budgetCode: 'Debe ser un código presupuestal válido (formato: 001-002-003)',
  siafCode: 'Debe ser un código SIAF válido (10 dígitos)',
  fiscalYear: (params: { minYear: number; maxYear: number }) => 
    `El año fiscal debe estar entre ${params.minYear} y ${params.maxYear}`,
  budgetAmount: 'El monto presupuestal debe ser válido y positivo',

  // Fechas
  futureDate: 'La fecha debe ser futura',
  pastDate: 'La fecha debe ser pasada',
  dateRange: 'La fecha de fin debe ser posterior a la fecha de inicio',

  // Comparaciones
  equalTo: (params: { otherField: string }) => `Debe ser igual al campo ${params.otherField}`,
  notEqualTo: (params: { otherField: string }) => `No debe ser igual al campo ${params.otherField}`,

  // Archivos
  file_too_large: (params: { maxSize: number; actualSize: number }) => 
    `El archivo es muy grande. Máximo: ${params.maxSize}MB, actual: ${params.actualSize}MB`,
  invalid_file_type: (params: { allowedTypes: string[]; actualType: string }) => 
    `Tipo de archivo no válido. Permitidos: ${params.allowedTypes.join(', ')}, actual: ${params.actualType}`,

  // Validaciones dinámicas
  at_least_one_required: 'Al menos un campo debe estar lleno',
  mutually_exclusive: 'Los campos son mutuamente exclusivos',
  sum_mismatch: (params: { expectedSum: number; actualSum: number }) => 
    `La suma debe ser ${params.expectedSum}, actual: ${params.actualSum}`,

  // Validaciones asíncronas
  async_error: 'Error en la validación del servidor',
  unique_email: 'Este email ya está en uso',
  unique_ruc: 'Este RUC ya está registrado',
  unique_dni: 'Este DNI ya está registrado',

  // Mensajes contextuales
  username_taken: 'Este nombre de usuario no está disponible',
  password_weak: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales',
  password_mismatch: 'Las contraseñas no coinciden',
  invalid_login: 'Email o contraseña incorrectos',
  account_locked: 'Cuenta bloqueada por múltiples intentos fallidos',

  // Campos específicos
  project_name: 'El nombre del proyecto debe ser descriptivo y único',
  project_description: 'La descripción debe explicar claramente los objetivos del proyecto',
  executing_unit: 'Debe seleccionar una unidad ejecutora válida',
  budget_goal: 'La meta presupuestal debe ser específica y medible',

  // Direcciones
  street_address: 'La dirección debe incluir nombre de calle y número',
  district_required: 'Debe especificar el distrito',
  province_required: 'Debe especificar la provincia',
  department_required: 'Debe especificar el departamento',
  postal_code: 'Código postal debe tener 5 dígitos',

  // Productos/Servicios
  product_name: 'El nombre del producto debe ser claro y descriptivo',
  product_price: 'El precio debe ser mayor a 0',
  product_stock: 'El stock no puede ser negativo',
  product_category: 'Debe seleccionar una categoría válida',
  product_sku: 'El SKU debe ser único y seguir el formato establecido',
  quantity_invalid: 'La cantidad debe ser un número positivo'
};

/**
 * Servicio para obtener mensajes de validación personalizados
 */
export class ValidationMessageService {
  private messages: ValidationMessageConfig = ValidationMessagesES;

  /**
   * Obtener mensaje para un código de error específico
   */
  getMessage(errorCode: string, params?: any): string {
    const messageTemplate = this.messages[errorCode];
    
    if (typeof messageTemplate === 'function') {
      return messageTemplate(params);
    }
    
    if (typeof messageTemplate === 'string') {
      return messageTemplate;
    }
    
    // Mensaje por defecto
    return `Error de validación: ${errorCode}`;
  }

  /**
   * Configurar mensajes personalizados
   */
  setMessages(messages: ValidationMessageConfig): void {
    this.messages = { ...this.messages, ...messages };
  }

  /**
   * Obtener todos los mensajes disponibles
   */
  getAllMessages(): ValidationMessageConfig {
    return { ...this.messages };
  }

  /**
   * Verificar si existe un mensaje para un código específico
   */
  hasMessage(errorCode: string): boolean {
    return errorCode in this.messages;
  }
}

/**
 * Mensajes específicos por contexto/formulario
 */
export const ContextualMessages = {
  userRegistration: {
    title: 'Registro de Usuario',
    subtitle: 'Complete todos los campos requeridos para crear su cuenta',
    success: '¡Usuario registrado exitosamente!',
    fields: {
      firstName: 'Ingrese su nombre',
      lastName: 'Ingrese su apellido',
      email: 'Email será usado para iniciar sesión',
      password: 'Mínimo 8 caracteres con mayúsculas, números y símbolos',
      confirmPassword: 'Repita la contraseña para confirmar',
      dni: 'Documento Nacional de Identidad peruano',
      phone: 'Número de celular o teléfono fijo'
    }
  },

  budgetProject: {
    title: 'Nuevo Proyecto Presupuestal',
    subtitle: 'Defina los parámetros del proyecto para el año fiscal',
    success: 'Proyecto creado y enviado para aprobación',
    fields: {
      projectName: 'Nombre que identifique claramente el proyecto',
      budgetCode: 'Código asignado por la oficina de presupuesto',
      fiscalYear: 'Año fiscal en que se ejecutará',
      budgetAmount: 'Monto total en soles peruanos',
      startDate: 'Fecha planificada de inicio',
      endDate: 'Fecha planificada de finalización',
      executingUnit: 'Unidad responsable de la ejecución'
    }
  },

  login: {
    title: 'Iniciar Sesión',
    subtitle: 'Acceda al sistema con sus credenciales',
    success: 'Bienvenido al sistema',
    fields: {
      email: 'Email registrado en el sistema',
      password: 'Contraseña de su cuenta'
    },
    links: {
      forgotPassword: '¿Olvidó su contraseña?',
      register: '¿No tiene cuenta? Regístrese aquí'
    }
  },

  productCatalog: {
    title: 'Catálogo de Productos',
    subtitle: 'Gestione el inventario de productos y servicios',
    success: 'Producto guardado exitosamente',
    fields: {
      name: 'Nombre comercial del producto',
      description: 'Descripción detallada de características y usos',
      price: 'Precio unitario en soles',
      stock: 'Cantidad disponible en inventario',
      category: 'Clasificación del producto',
      sku: 'Código único de identificación'
    }
  }
};

/**
 * Helpers para formatear mensajes
 */
export const MessageFormatters = {
  /**
   * Formatear mensaje con parámetros
   */
  format(template: string, params: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match;
    });
  },

  /**
   * Capitalizar primera letra
   */
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  /**
   * Convertir campo técnico a nombre legible
   */
  fieldNameToLabel(fieldName: string): string {
    const fieldLabels: Record<string, string> = {
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Email',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      dni: 'DNI',
      ruc: 'RUC',
      phone: 'Teléfono',
      budgetCode: 'Código presupuestal',
      fiscalYear: 'Año fiscal',
      budgetAmount: 'Monto presupuestal',
      startDate: 'Fecha de inicio',
      endDate: 'Fecha de fin',
      projectName: 'Nombre del proyecto',
      projectDescription: 'Descripción del proyecto'
    };

    return fieldLabels[fieldName] || fieldName;
  },

  /**
   * Formatear lista de errores
   */
  formatErrorList(errors: string[]): string {
    if (errors.length === 0) return '';
    if (errors.length === 1) return errors[0];
    
    return `• ${errors.join('\n• ')}`;
  }
};

// Instancia global del servicio de mensajes
export const validationMessageService = new ValidationMessageService();