import { http, HttpResponse } from 'msw';

/**
 * Datos mock para autenticación
 */
const mockCredentials = {
  'admin@mef.gob.pe': {
    password: 'admin123',
    user: {
      id: 'user-001',
      name: 'María González',
      email: 'admin@mef.gob.pe',
      role: 'admin',
      permissions: ['users:read', 'users:write', 'products:read', 'products:write', 'admin:access']
    }
  },
  'user@mef.gob.pe': {
    password: 'user123',
    user: {
      id: 'user-002',
      name: 'Carlos Mendoza',
      email: 'user@mef.gob.pe',
      role: 'user',
      permissions: ['products:read', 'products:reserve']
    }
  }
};

/**
 * Generar JWT token mock
 */
function generateMockToken(user: any): string {
  const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8) // 8 horas
  }));
  const signature = btoa('mock-signature-' + Date.now());
  
  return `${header}.${payload}.${signature}`;
}

/**
 * MSW Handlers para autenticación
 */
export const authHandlers = [
  // POST /api/auth/login - Iniciar sesión
  http.post('/api/auth/login', async ({ request }) => {
    try {
      const { email, password } = await request.json() as { email: string; password: string };

      // Simular delay de autenticación
      await new Promise(resolve => setTimeout(resolve, 800));

      // Validar credenciales
      const credentials = mockCredentials[email as keyof typeof mockCredentials];
      
      if (!credentials || credentials.password !== password) {
        return HttpResponse.json({
          error: 'Authentication failed',
          message: 'Credenciales inválidas',
          code: 'INVALID_CREDENTIALS'
        }, { status: 401 });
      }

      // Simular falla del servidor (5% de las veces)
      if (Math.random() < 0.05) {
        return HttpResponse.json({
          error: 'Service unavailable',
          message: 'Servicio de autenticación temporalmente no disponible',
          code: 'SERVICE_UNAVAILABLE'
        }, { status: 503 });
      }

      const token = generateMockToken(credentials.user);

      return HttpResponse.json({
        data: {
          user: credentials.user,
          token,
          expiresIn: 28800, // 8 horas en segundos
          tokenType: 'Bearer'
        },
        message: 'Autenticación exitosa'
      }, { 
        status: 200,
        headers: {
          'X-Auth-Provider': 'MSW-Mock'
        }
      });

    } catch (error) {
      return HttpResponse.json({
        error: 'Bad request',
        message: 'Formato de solicitud inválido',
        code: 'BAD_REQUEST'
      }, { status: 400 });
    }
  }),

  // POST /api/auth/refresh - Renovar token
  http.post('/api/auth/refresh', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({
        error: 'Unauthorized',
        message: 'Token de acceso requerido',
        code: 'MISSING_TOKEN'
      }, { status: 401 });
    }

    try {
      const token = authHeader.split(' ')[1];
      
      // Simular validación de token (mock)
      if (token.includes('mock-signature')) {
        // Extraer payload del token mock
        const payloadPart = token.split('.')[1];
        const payload = JSON.parse(atob(payloadPart));
        
        // Verificar si no ha expirado (mock)
        if (payload.exp < Math.floor(Date.now() / 1000)) {
          return HttpResponse.json({
            error: 'Token expired',
            message: 'Token ha expirado',
            code: 'TOKEN_EXPIRED'
          }, { status: 401 });
        }

        // Generar nuevo token
        const newToken = generateMockToken({
          id: payload.sub,
          email: payload.email,
          role: payload.role,
          permissions: payload.permissions
        });

        return HttpResponse.json({
          data: {
            token: newToken,
            expiresIn: 28800,
            tokenType: 'Bearer'
          },
          message: 'Token renovado exitosamente'
        }, { status: 200 });
      }

      return HttpResponse.json({
        error: 'Invalid token',
        message: 'Token inválido',
        code: 'INVALID_TOKEN'
      }, { status: 401 });

    } catch (error) {
      return HttpResponse.json({
        error: 'Invalid token',
        message: 'Token malformado',
        code: 'MALFORMED_TOKEN'
      }, { status: 401 });
    }
  }),

  // GET /api/auth/me - Obtener perfil del usuario actual
  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({
        error: 'Unauthorized',
        message: 'Token de acceso requerido',
        code: 'MISSING_TOKEN'
      }, { status: 401 });
    }

    try {
      const token = authHeader.split(' ')[1];
      
      if (token.includes('mock-signature')) {
        const payloadPart = token.split('.')[1];
        const payload = JSON.parse(atob(payloadPart));
        
        // Verificar expiración
        if (payload.exp < Math.floor(Date.now() / 1000)) {
          return HttpResponse.json({
            error: 'Token expired',
            message: 'Token ha expirado',
            code: 'TOKEN_EXPIRED'
          }, { status: 401 });
        }

        const user = {
          id: payload.sub,
          email: payload.email,
          role: payload.role,
          permissions: payload.permissions,
          name: Object.values(mockCredentials).find(c => c.user.id === payload.sub)?.user.name || 'Usuario',
          lastLogin: new Date(),
          isActive: true
        };

        return HttpResponse.json({
          data: user
        }, { status: 200 });
      }

      return HttpResponse.json({
        error: 'Invalid token',
        message: 'Token inválido',
        code: 'INVALID_TOKEN'
      }, { status: 401 });

    } catch (error) {
      return HttpResponse.json({
        error: 'Invalid token',
        message: 'Token malformado',
        code: 'MALFORMED_TOKEN'
      }, { status: 401 });
    }
  }),

  // POST /api/auth/logout - Cerrar sesión
  http.post('/api/auth/logout', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    // Simular logout exitoso independientemente del token
    return HttpResponse.json({
      message: 'Sesión cerrada exitosamente'
    }, { status: 200 });
  }),

  // POST /api/auth/forgot-password - Solicitar reset de contraseña
  http.post('/api/auth/forgot-password', async ({ request }) => {
    try {
      const { email } = await request.json() as { email: string };

      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar si el email existe
      const userExists = Object.keys(mockCredentials).includes(email);
      
      // Por seguridad, siempre retornar éxito (no revelar si el email existe)
      return HttpResponse.json({
        message: 'Si el email existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña',
        data: {
          emailSent: userExists,
          resetTokenExpiry: userExists ? new Date(Date.now() + 15 * 60 * 1000) : null // 15 minutos
        }
      }, { status: 200 });

    } catch (error) {
      return HttpResponse.json({
        error: 'Bad request',
        message: 'Email requerido',
        code: 'BAD_REQUEST'
      }, { status: 400 });
    }
  }),

  // GET /api/auth/permissions - Obtener permisos disponibles
  http.get('/api/auth/permissions', () => {
    const allPermissions = [
      { id: 'users:read', name: 'Leer usuarios', category: 'users' },
      { id: 'users:write', name: 'Escribir usuarios', category: 'users' },
      { id: 'products:read', name: 'Leer productos', category: 'products' },
      { id: 'products:write', name: 'Escribir productos', category: 'products' },
      { id: 'products:reserve', name: 'Reservar productos', category: 'products' },
      { id: 'admin:access', name: 'Acceso administrativo', category: 'admin' },
      { id: 'reports:read', name: 'Ver reportes', category: 'reports' },
      { id: 'audit:read', name: 'Ver auditoría', category: 'audit' }
    ];

    const categories = [...new Set(allPermissions.map(p => p.category))];

    return HttpResponse.json({
      data: {
        permissions: allPermissions,
        categories: categories.map(cat => ({
          id: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
          permissions: allPermissions.filter(p => p.category === cat)
        }))
      }
    }, { status: 200 });
  })
];