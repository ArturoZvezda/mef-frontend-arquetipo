/**
 * Puerto para servicio de logging
 * Permite abstraer el sistema de logging de la lógica de aplicación
 */
export interface LoggingPort {
  /**
   * Registrar mensaje informativo
   * @param message - Mensaje a registrar
   * @param metadata - Datos adicionales opcionales
   */
  info(message: string, metadata?: Record<string, any>): void;

  /**
   * Registrar advertencia
   * @param message - Mensaje de advertencia
   * @param metadata - Datos adicionales opcionales
   */
  warn(message: string, metadata?: Record<string, any>): void;

  /**
   * Registrar error
   * @param message - Mensaje de error
   * @param error - Error original opcional
   * @param metadata - Datos adicionales opcionales
   */
  error(message: string, error?: Error, metadata?: Record<string, any>): void;

  /**
   * Registrar mensaje de debug
   * @param message - Mensaje de debug
   * @param metadata - Datos adicionales opcionales
   */
  debug(message: string, metadata?: Record<string, any>): void;

  /**
   * Crear logger con contexto específico
   * @param context - Contexto del logger (ej: 'UserService', 'ProductRepository')
   * @returns Nueva instancia de logger con contexto
   */
  withContext(context: string): LoggingPort;
}