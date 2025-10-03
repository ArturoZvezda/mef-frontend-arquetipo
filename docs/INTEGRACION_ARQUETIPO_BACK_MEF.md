# 🔗 Integración con arquetipo-back-mef

## 📋 Resumen de la Integración

Esta documentación describe la integración del frontend con el backend `arquetipo-back-mef`, que maneja **solicitudes** en lugar de usuarios, utilizando una **arquitectura híbrida** que mantiene la compatibilidad con la interfaz existente del frontend.

### 🔄 **Adaptación Realizada**

El frontend mapea **solicitudes del backend** como **usuarios** para mantener compatibilidad con la UI existente:

```
Backend: Solicitud → Frontend: Usuario
- solicitud.id → usuario.id
- solicitud.solicitante → usuario.nombre + usuario.apellido
- solicitud.estado → usuario.activo
```

---

## 🏗️ Arquitectura del Backend arquetipo-back-mef

### **Estructura del Proyecto**
```
arquetipo-back-mef/
├── src/main/java/pe/gob/mef/siafrp/arquetipo_back/
│   ├── application/           # 🔧 Servicios de aplicación
│   ├── domain/               # 🎯 Entidades y lógica de dominio
│   │   ├── entity/           # Entidades JPA
│   │   ├── mongo/            # Entidades MongoDB
│   │   └── enums/            # Enumeraciones
│   ├── port/
│   │   ├── inbound/          # 📥 Controllers REST
│   │   └── outbound/         # 📤 Repositories
│   └── config/               # ⚙️ Configuración (Kafka, etc.)
└── src/main/resources/
    ├── application.properties      # Configuración base
    └── application-local.properties # Configuración local
```

### **Tecnologías Utilizadas**
- **Java + Spring Boot 3.x**
- **Spring Data JPA** (Oracle Database)
- **Spring Data MongoDB** (NoSQL)
- **Apache Kafka** (opcional)
- **Docker** para contenedorización

---

## 🔌 Endpoints Disponibles

### **Solicitudes API** (`/v1/solicitudes`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/v1/solicitudes?page={page}&size={size}` | Listar solicitudes paginadas |
| `GET` | `/v1/solicitudes/{id}` | Obtener solicitud por ID |
| `POST` | `/v1/solicitudes` | Crear nueva solicitud |
| `PUT` | `/v1/solicitudes/{id}` | Actualizar solicitud |
| `DELETE` | `/v1/solicitudes/{id}` | Eliminar solicitud |

### **Estructura de Datos**

#### Solicitud (Backend)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "titulo": "Solicitud de acceso",
  "descripcion": "Descripción detallada",
  "estado": "PENDIENTE",
  "fechaCreacion": "2025-01-28T10:00:00Z",
  "solicitante": "Juan Pérez"
}
```

#### Usuario Mapeado (Frontend)
```json
{
  "id": 12345,
  "nombre": "Juan",
  "apellido": "Pérez",
  "segundoApellido": "507f1f77",
  "correoElectronico": "solicitud-507f1f77bcf86cd799439011@mef.gob.pe",
  "documento": "507f1f77bcf86cd799439011",
  "idUsuario": "507f1f77bcf86cd799439011",
  "activo": false
}
```

---

## ⚙️ Configuración del Frontend

### **Servicio de Cliente HTTP**

```typescript
// adapters/src/lib/http/mef-backend-client.service.ts
@Injectable({
  providedIn: 'root'
})
export class MefBackendClientService {
  private readonly baseUrl = 'http://localhost:8080/v1/solicitudes';

  // Mapear solicitudes como usuarios para compatibilidad
  getUsuariosPaginados(params: any): Observable<MefPaginatedResponse<MefUsuarioDto>> {
    const page = Math.floor((params.skip_count || 0) / (params.max_result_count || 10));
    const size = params.max_result_count || 10;

    return this.http.get<any>(`${this.baseUrl}?page=${page}&size=${size}`)
      .pipe(
        map(response => this.mapSolicitudesToUsers(response))
      );
  }

  private mapSolicitudesToUsers(response: any): MefPaginatedResponse<MefUsuarioDto> {
    const usuarios: MefUsuarioDto[] = response.content.map((solicitud: any) => ({
      id: parseInt(solicitud.id) || 0,
      nombre: solicitud.solicitante?.split(' ')[0] || 'Solicitante',
      apellido: solicitud.solicitante?.split(' ')[1] || 'Solicitud',
      segundoApellido: solicitud.id?.substring(0, 8) || '',
      correoElectronico: `solicitud-${solicitud.id}@mef.gob.pe`,
      documento: solicitud.id || '',
      idUsuario: solicitud.id || '',
      activo: solicitud.estado === 'ACTIVO'
    }));

    return {
      totalCount: response.totalElements || response.content.length,
      items: usuarios
    };
  }
}
```

---

## 🚀 Configuración de Desarrollo

### **1. Configurar Backend**

```bash
# Navegar al directorio del backend
cd C:\dev\mef\arquetipo-back-mef\arquetipo-back-mef

# Levantar con perfil local
./gradlew bootRun --args='--spring.profiles.active=local'
```

### **2. Configurar Frontend**

```bash
# Navegar al frontend
cd C:\dev\mef\mef-frontend-arquetipo

# Instalar dependencias
npm install

# Servir la aplicación
npx nx serve host
```

### **3. Verificar Conexión**

```bash
# Test endpoint de solicitudes
curl "http://localhost:8080/v1/solicitudes?page=0&size=5"

# Test desde frontend (abrir navegador)
http://localhost:4200
```

---

## 🐳 Despliegue con Docker

### **Backend con Docker Compose**

```yaml
# docker-compose.yml (en arquetipo-back-mef)
version: '3.8'
services:
  arquetipo-mef:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - SPRING_DATASOURCE_URL=jdbc:oracle:thin:@oracle-db:1521/XEPDB1
      - SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/siafrp
    depends_on:
      - oracle-db
      - mongodb
      
  oracle-db:
    image: container-registry.oracle.com/database/free:latest
    ports:
      - "1521:1521"
    environment:
      - ORACLE_PWD=Oracle123
      
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=rootpass
```

---

## 🔍 Testing y Debugging

### **Testing de Endpoints**

```bash
# Crear solicitud
curl -X POST http://localhost:8080/v1/solicitudes \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Test Solicitud",
    "descripcion": "Solicitud de prueba",
    "estado": "PENDIENTE",
    "solicitante": "Usuario Test"
  }'

# Listar solicitudes
curl "http://localhost:8080/v1/solicitudes?page=0&size=10"

# Obtener solicitud por ID
curl http://localhost:8080/v1/solicitudes/{id}
```

### **Debug del Frontend**

```typescript
// Activar logs en el servicio
console.log('Connecting to MEF backend:', this.baseUrl);
console.log('Mapped users:', usuarios);
```

### **Logs del Backend**

```properties
# application-local.properties
logging.level.pe.gob.mef.siafrp.arquetipo_back=DEBUG
spring.jpa.show-sql=true
```

---

## ⚠️ Consideraciones Importantes

### **Limitaciones de la Adaptación**

1. **Mapeo de Datos**: Las solicitudes se mapean como usuarios, perdiendo some contextual information
2. **Operaciones CRUD**: Crear "usuario" realmente crea una solicitud en el backend  
3. **Búsquedas**: Los filtros de usuario no se aplican directamente a solicitudes
4. **Validaciones**: Las reglas de negocio de usuarios no se aplican a solicitudes

### **Ventajas**

1. **Compatibilidad**: El frontend existente funciona sin cambios mayores
2. **Rápida Implementación**: Cambio mínimo de código
3. **Transparente**: El usuario final no nota la diferencia
4. **Evolutiva**: Se puede migrar gradualmente

### **Próximos Pasos Recomendados**

1. **Crear endpoints específicos** de usuarios en `arquetipo-back-mef`
2. **Implementar autenticación** OAuth2/JWT
3. **Agregar validaciones** específicas de dominio
4. **Migrar gradualmente** de mapeo a endpoints nativos

---

## 📚 Referencias

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data MongoDB](https://spring.io/projects/spring-data-mongodb)
- [Apache Kafka](https://kafka.apache.org/documentation/)
- [Oracle Database](https://docs.oracle.com/en/database/)

---

## 🤝 Soporte

Para problemas específicos con la integración:

1. **Backend Issues**: Revisar logs en `C:\dev\mef\arquetipo-back-mef\logs\`
2. **Frontend Issues**: Abrir Developer Tools y revisar Network tab
3. **Connection Issues**: Verificar que ambos servicios estén corriendo
4. **Data Issues**: Revisar mapeo en `MefBackendClientService`

---

**✅ Integración completada y funcionando** con `arquetipo-back-mef` v1.0.0