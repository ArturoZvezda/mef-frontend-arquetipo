# 🎯 Ejemplo Completo: Caso de Uso "Activar Usuario"

Este documento muestra paso a paso la implementación completa del caso de uso "Activar Usuario" siguiendo los principios de **DDD + Event-Driven Design**.

## 📋 Resumen del Ejemplo

Hemos implementado un caso de uso completo que incluye:

- ✅ **Entidad de Dominio** extendida con nueva funcionalidad
- ✅ **Value Objects** y **Domain Events** apropiados
- ✅ **Caso de Uso** con lógica de negocio
- ✅ **Event Handler** para side effects
- ✅ **Componente Demo** para visualizar el flujo
- ✅ **Manejo de Errores** robusto
- ✅ **Logging** estructurado

## 🏗️ Arquitectura Implementada

```
┌─────────────────────────────────────────────────────────┐
│                     PRESENTACIÓN                       │
├─────────────────────────────────────────────────────────┤
│  • UserManagementDemoComponent                          │  
│  • Formularios reactivos con Angular Signals           │
│  • UI en tiempo real para eventos                      │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                     APLICACIÓN                         │
├─────────────────────────────────────────────────────────┤
│  • ActivateUserUseCase                                  │
│  • UserActivatedHandler                                │
│  • Commands: ActivateUserCommand                       │
│  • Events: UserActivatedEvent                          │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                      DOMINIO                           │
├─────────────────────────────────────────────────────────┤
│  • User.activate() - Regla de negocio                  │
│  • UserStatus enum                                     │
│  • UserAlreadyActiveError, UserSuspendedError          │
└─────────────────────────────────────────────────────────┘
```

## 📂 Archivos Creados/Modificados

### 🎯 Capa de Dominio

#### 1. Entidad User extendida
**📁 `domain/src/lib/entities/user.entity.ts`**
```typescript
// Nuevas propiedades y métodos agregados:
- status: UserStatus 
- activate(): void
- suspend(): void  
- getStatus(): UserStatus

// Reglas de negocio implementadas:
- No se puede activar un usuario ya activo
- No se puede activar un usuario suspendido
```

#### 2. Enum UserStatus
```typescript
export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE', 
  SUSPENDED = 'SUSPENDED'
}
```

#### 3. Nuevos Domain Errors
**📁 `domain/src/lib/domain-errors/user.errors.ts`**
```typescript
- UserAlreadyActiveError
- UserSuspendedError
```

### 🔧 Capa de Aplicación

#### 4. Caso de Uso: ActivateUserUseCase
**📁 `application/src/lib/use-cases/user/activate-user.use-case.ts`**

**Flujo implementado:**
1. ✅ Validar entrada y buscar usuario
2. ✅ Aplicar regla de negocio (`user.activate()`)
3. ✅ Persistir cambios
4. ✅ Publicar evento de dominio
5. ✅ Retornar DTO actualizado

#### 5. Command y DTO
**📁 `application/src/lib/dtos/commands/user.commands.ts`**
```typescript
interface ActivateUserCommand {
  userId: string;
  activatedBy: string;
  reason?: string;
}
```

**📁 `application/src/lib/dtos/user.dto.ts`**
```typescript
interface UserDto {
  // ... campos existentes
  status: string; // ← Campo agregado
}
```

#### 6. Domain Event
**📁 `application/src/lib/ports/event-bus.port.ts`**
```typescript
interface UserActivatedEvent extends DomainEvent {
  type: 'USER_ACTIVATED';
  payload: {
    userId: string;
    email: string;
    name: string;
    activatedBy: string;
    activatedAt: Date;
    reason?: string;
  };
}
```

#### 7. Event Handler
**📁 `application/src/lib/handlers/user-activated.handler.ts`**

**Side Effects implementados:**
- ✅ Envío de email de confirmación
- ✅ Notificación al activador
- ✅ Registro de métricas
- ✅ Actualización de permisos

### 🎨 Capa de Presentación

#### 8. Componente Demo Completo
**📁 `host/src/app/components/user-management-demo/user-management-demo.component.ts`**

**Funcionalidades:**
- ✅ Crear usuarios
- ✅ Activar usuarios con un click
- ✅ Ver eventos en tiempo real
- ✅ Estadísticas actualizadas
- ✅ UI responsive con estados de loading

## 🚀 Cómo Probar el Ejemplo

### 1. Servir la Aplicación
```bash
cd mef-frontend-arquetipo
npx nx serve host
```

### 2. Navegar al Componente
Ir a: `http://localhost:4200` y buscar el componente "Gestión de Usuarios"

### 3. Flujo de Prueba
1. **Crear Usuario**: Llena el formulario y crea un usuario
2. **Observar Evento**: Ve el evento `USER_CREATED` en tiempo real
3. **Activar Usuario**: Click en "✅ Activar" en el usuario pendiente
4. **Ver Side Effects**: Observa los logs del evento `USER_ACTIVATED`
5. **Verificar Estado**: El usuario cambia a estado "Activo"

### 4. Verificar en Developer Tools
```javascript
// En la consola del navegador, verás logs como:
📡 Publishing event: USER_CREATED
🎉 Processing USER_ACTIVATED event for: Usuario Demo 123
📧 Activation confirmation email sent to demo@mef.gob.pe
✅ User activation processed successfully
```

## 🧪 Testing del Ejemplo

### Casos de Prueba Cubiertos

#### Entidad User
- ✅ Activar usuario pendiente → Éxito
- ✅ Activar usuario ya activo → `UserAlreadyActiveError`
- ✅ Activar usuario suspendido → `UserSuspendedError`

#### Caso de Uso
- ✅ Activación exitosa con evento publicado
- ✅ Usuario no encontrado → `UserNotFoundError`
- ✅ Logging correcto en todos los escenarios

#### Event Handler
- ✅ Procesamiento exitoso de evento
- ✅ Manejo de errores en notificaciones
- ✅ Side effects ejecutados correctamente

## 🎯 Patrones Implementados

### 1. **Domain-Driven Design**
```typescript
// Lógica de negocio en la entidad
user.activate(); // ← La regla está en el dominio

// Casos de uso orquestan, no contienen lógica de negocio
await this.eventBus.publish(userActivatedEvent);
```

### 2. **Event-Driven Architecture**
```typescript
// Publicar eventos después de cambios importantes
const event: UserActivatedEvent = {
  type: 'USER_ACTIVATED',
  occurredOn: new Date(),
  aggregateId: user.getId().getValue(),
  payload: { /* datos del evento */ }
};

await this.eventBus.publish(event);
```

### 3. **Dependency Inversion**
```typescript
// Casos de uso dependen de abstracciones (puertos)
constructor(
  private userRepository: UserRepositoryPort, // ← Puerto
  private eventBus: EventBusPort,             // ← Puerto
  loggingPort: LoggingPort                    // ← Puerto
) { }
```

### 4. **Command Query Separation**
```typescript
// Commands modifican estado
interface ActivateUserCommand { /* datos para modificar */ }

// Queries solo consultan
interface GetUserByIdQuery { /* datos para consultar */ }
```

### 5. **Single Responsibility**
- `ActivateUserUseCase`: Solo maneja activación
- `UserActivatedHandler`: Solo maneja side effects del evento
- `User.activate()`: Solo aplica regla de negocio

## 🔍 Observabilidad Implementada

### Logging Estructurado
```typescript
this.logger.info('User activation started', {
  userId: command.userId,
  activatedBy: command.activatedBy,
  timestamp: new Date().toISOString()
});
```

### Métricas de Eventos
- Eventos publicados y manejados
- Duración de casos de uso
- Errores por tipo

### Trazabilidad
- Correlation IDs en logs
- Event sourcing básico
- Audit trail de activaciones

## 💡 Siguientes Pasos

### Para Extender el Ejemplo:

1. **Agregar Más Estados**
   ```typescript
   // Nuevos estados de usuario
   enum UserStatus {
     PENDING = 'PENDING',
     ACTIVE = 'ACTIVE',
     SUSPENDED = 'SUSPENDED',
     EXPIRED = 'EXPIRED',      // ← Nuevo
     DEACTIVATED = 'DEACTIVATED' // ← Nuevo
   }
   ```

2. **Implementar CQRS**
   ```typescript
   // Separar comandos de queries
   class UserCommandService { /* solo modificaciones */ }
   class UserQueryService { /* solo consultas */ }
   ```

3. **Agregar Validaciones**
   ```typescript
   // Validaciones de dominio más complejas
   validateActivationPolicy(user: User, activator: User): void
   ```

4. **Event Sourcing**
   ```typescript
   // Almacenar eventos en lugar de estado
   class UserEventStore {
     append(events: DomainEvent[]): void
   }
   ```

## 📚 Recursos Relacionados

- 📖 [Guía Principal DDD + Event-Driven](./GUIA_DDD_EVENT_DRIVEN.md)
- 🏗️ [Documentación de Arquitectura](./ARCHITECTURE.md)
- 🚀 [Getting Started](./GETTING_STARTED.md)

---

## ✅ Conclusión

Este ejemplo demuestra una implementación completa de **DDD + Event-Driven Design** en un frontend Angular, mostrando:

- 🎯 **Separación clara** de responsabilidades por capas
- 📡 **Comunicación asíncrona** mediante eventos
- 🔄 **Side effects** manejados correctamente
- 🧪 **Testing** en todos los niveles
- 📊 **Observabilidad** completa

El patrón es **escalable**, **mantenible** y permite agregar nuevas funcionalidades sin afectar código existente.

¡Usa este ejemplo como base para implementar tus propios casos de uso! 🚀