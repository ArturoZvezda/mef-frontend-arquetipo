import { http, HttpResponse } from 'msw';
import { UserDto } from '@mef-frontend-arquetipo/application';

/**
 * Datos mock para usuarios - simulan respuestas de API real
 */
// Extended user interface for internal use (with role field)
interface MockUser extends UserDto {
  role: string;
}

const mockUsers: MockUser[] = [
  {
    id: 'user-001',
    name: 'María González',
    email: 'maria.gonzalez@mef.gob.pe',
    role: 'admin',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
    isActive: true
  },
  {
    id: 'user-002', 
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@mef.gob.pe',
    role: 'user',
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
    isActive: true
  },
  {
    id: 'user-003',
    name: 'Ana Rojas',
    email: 'ana.rojas@mef.gob.pe', 
    role: 'viewer',
    createdAt: '2024-02-10T00:00:00.000Z',
    updatedAt: '2024-02-10T00:00:00.000Z',
    isActive: false
  },
  {
    id: 'user-004',
    name: 'Luis Fernández',
    email: 'luis.fernandez@mef.gob.pe',
    role: 'user',
    createdAt: '2024-02-15T00:00:00.000Z',
    updatedAt: '2024-02-15T00:00:00.000Z',
    isActive: true
  }
];

/**
 * MSW Handlers para endpoints de usuarios
 * Simulan una API REST completa con todos los métodos HTTP
 */
export const userHandlers = [
  // GET /api/users - Obtener todos los usuarios
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const role = url.searchParams.get('role') || '';

    let filteredUsers = [...mockUsers];

    // Filtrar por búsqueda
    if (search) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtrar por rol
    if (role) {
      filteredUsers = filteredUsers.filter(user => (user as MockUser).role === role);
    }

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Simular delay de red
    const delay = Math.random() * 500 + 200; // 200-700ms

    return HttpResponse.json({
      data: paginatedUsers,
      meta: {
        total: filteredUsers.length,
        page,
        limit,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    }, { 
      status: 200,
      headers: {
        'X-Response-Time': delay.toString(),
        'X-Mock-Source': 'MSW'
      }
    });
  }),

  // GET /api/users/:id - Obtener usuario por ID
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    const user = mockUsers.find(u => u.id === id);

    if (!user) {
      return HttpResponse.json({
        error: 'User not found',
        message: `Usuario con ID ${id} no encontrado`,
        code: 'USER_NOT_FOUND'
      }, { status: 404 });
    }

    return HttpResponse.json({
      data: user
    }, { status: 200 });
  }),

  // POST /api/users - Crear nuevo usuario
  http.post('/api/users', async ({ request }) => {
    try {
      const newUserData = await request.json() as Partial<UserDto>;

      // Validaciones básicas
      if (!newUserData.name || !newUserData.email) {
        return HttpResponse.json({
          error: 'Validation failed',
          message: 'Nombre y email son requeridos',
          code: 'VALIDATION_ERROR',
          details: {
            fields: {
              name: !newUserData.name ? 'Name is required' : null,
              email: !newUserData.email ? 'Email is required' : null
            }
          }
        }, { status: 400 });
      }

      // Verificar email único
      const existingUser = mockUsers.find(u => u.email === newUserData.email);
      if (existingUser) {
        return HttpResponse.json({
          error: 'Conflict',
          message: 'Ya existe un usuario con este email',
          code: 'EMAIL_ALREADY_EXISTS'
        }, { status: 409 });
      }

      // Crear nuevo usuario
      const newUser: MockUser = {
        id: `user-${Date.now()}`,
        name: newUserData.name,
        email: newUserData.email,
        role: (newUserData as any).role || 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };

      // Agregar a la "base de datos" mock
      mockUsers.push(newUser);

      return HttpResponse.json({
        data: newUser,
        message: 'Usuario creado exitosamente'
      }, { status: 201 });

    } catch (error) {
      return HttpResponse.json({
        error: 'Internal server error',
        message: 'Error procesando la solicitud',
        code: 'INTERNAL_ERROR'
      }, { status: 500 });
    }
  }),

  // PUT /api/users/:id - Actualizar usuario
  http.put('/api/users/:id', async ({ params, request }) => {
    const { id } = params;
    const userIndex = mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return HttpResponse.json({
        error: 'User not found',
        message: `Usuario con ID ${id} no encontrado`,
        code: 'USER_NOT_FOUND'
      }, { status: 404 });
    }

    try {
      const updateData = await request.json() as Partial<UserDto>;
      
      // Verificar email único (si se está actualizando)
      if (updateData.email) {
        const existingUser = mockUsers.find(u => u.email === updateData.email && u.id !== id);
        if (existingUser) {
          return HttpResponse.json({
            error: 'Conflict',
            message: 'Ya existe un usuario con este email',
            code: 'EMAIL_ALREADY_EXISTS'
          }, { status: 409 });
        }
      }

      // Actualizar usuario
      const updatedUser: MockUser = {
        ...mockUsers[userIndex],
        ...updateData,
        id, // Mantener ID original
        updatedAt: new Date().toISOString()
      } as MockUser;

      mockUsers[userIndex] = updatedUser;

      return HttpResponse.json({
        data: updatedUser,
        message: 'Usuario actualizado exitosamente'
      }, { status: 200 });

    } catch (error) {
      return HttpResponse.json({
        error: 'Internal server error',
        message: 'Error procesando la solicitud',
        code: 'INTERNAL_ERROR'
      }, { status: 500 });
    }
  }),

  // DELETE /api/users/:id - Eliminar usuario
  http.delete('/api/users/:id', ({ params }) => {
    const { id } = params;
    const userIndex = mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return HttpResponse.json({
        error: 'User not found',
        message: `Usuario con ID ${id} no encontrado`,
        code: 'USER_NOT_FOUND'
      }, { status: 404 });
    }

    // Soft delete - marcar como inactivo
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      isActive: false,
      updatedAt: new Date().toISOString()
    };

    return HttpResponse.json({
      message: 'Usuario eliminado exitosamente'
    }, { status: 200 });
  }),

  // PATCH /api/users/:id/activate - Activar/desactivar usuario
  http.patch('/api/users/:id/activate', async ({ params, request }) => {
    const { id } = params;
    const userIndex = mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return HttpResponse.json({
        error: 'User not found',
        message: `Usuario con ID ${id} no encontrado`,
        code: 'USER_NOT_FOUND'
      }, { status: 404 });
    }

    try {
      const { isActive } = await request.json() as { isActive: boolean };

      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        isActive,
        updatedAt: new Date().toISOString()
      };

      return HttpResponse.json({
        data: mockUsers[userIndex],
        message: `Usuario ${isActive ? 'activado' : 'desactivado'} exitosamente`
      }, { status: 200 });

    } catch (error) {
      return HttpResponse.json({
        error: 'Internal server error',
        message: 'Error procesando la solicitud',
        code: 'INTERNAL_ERROR'
      }, { status: 500 });
    }
  })
];