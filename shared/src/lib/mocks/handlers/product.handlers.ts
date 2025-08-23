import { http, HttpResponse } from 'msw';
import { ProductDto, CreateProductDto } from '@mef-frontend-arquetipo/application';

/**
 * Helper function to create formatted price
 */
function createPrice(amount: number, currency: string = 'PEN') {
  return {
    amount,
    currency,
    formatted: `${currency} ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
  };
}

/**
 * Datos mock para productos - simulan catálogo del MEF
 */
const mockProducts: ProductDto[] = [
  {
    id: 'prod-001',
    name: 'Licencia Software Contable',
    description: 'Licencia anual para software de contabilidad gubernamental',
    price: createPrice(15000.00),
    stock: 25,
    category: 'software',
    isAvailable: true,
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z'
  },
  {
    id: 'prod-002',
    name: 'Servicio Consultoría Tributaria',
    description: 'Consultoría especializada en normativa tributaria peruana',
    price: createPrice(8500.00),
    stock: 10,
    category: 'servicios',
    isAvailable: true,
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'prod-003',
    name: 'Capacitación Gestión Pública',
    description: 'Programa de capacitación en gestión financiera pública',
    price: createPrice(2500.00),
    stock: 50,
    category: 'capacitacion',
    isAvailable: true,
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z'
  },
  {
    id: 'prod-004',
    name: 'Equipos Tecnológicos',
    description: 'Laptops y equipos para personal administrativo',
    price: createPrice(3200.00),
    stock: 5,
    category: 'hardware',
    isAvailable: true,
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z'
  },
  {
    id: 'prod-005',
    name: 'Auditoría Externa',
    description: 'Servicios de auditoría externa para entidades públicas',
    price: createPrice(25000.00),
    stock: 3,
    category: 'servicios',
    isAvailable: true,
    createdAt: '2024-02-05T00:00:00.000Z',
    updatedAt: '2024-02-05T00:00:00.000Z'
  },
  {
    id: 'prod-006',
    name: 'Sistema ERP Gubernamental',
    description: 'Sistema integrado de planificación de recursos empresariales',
    price: createPrice(45000.00),
    stock: 0, // Sin stock para probar escenarios
    category: 'software',
    isAvailable: false,
    createdAt: '2024-02-10T00:00:00.000Z',
    updatedAt: '2024-02-10T00:00:00.000Z'
  }
];

/**
 * MSW Handlers para endpoints de productos
 */
export const productHandlers = [
  // GET /api/products - Obtener todos los productos
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const minPrice = parseFloat(url.searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(url.searchParams.get('maxPrice') || '999999');
    const inStock = url.searchParams.get('inStock') === 'true';

    let filteredProducts = [...mockProducts];

    // Filtros
    if (search) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    if (minPrice > 0 || maxPrice < 999999) {
      filteredProducts = filteredProducts.filter(product => 
        product.price.amount >= minPrice && product.price.amount <= maxPrice
      );
    }

    if (inStock) {
      filteredProducts = filteredProducts.filter(product => product.stock > 0);
    }

    // Solo productos activos por defecto
    filteredProducts = filteredProducts.filter(product => product.isAvailable);

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Simular delay variable
    const delay = Math.random() * 600 + 300; // 300-900ms

    return HttpResponse.json({
      data: paginatedProducts,
      meta: {
        total: filteredProducts.length,
        page,
        limit,
        totalPages: Math.ceil(filteredProducts.length / limit),
        filters: {
          search,
          category,
          priceRange: { min: minPrice, max: maxPrice },
          inStock
        }
      }
    }, { 
      status: 200,
      headers: {
        'X-Response-Time': delay.toString(),
        'X-Mock-Source': 'MSW-Products'
      }
    });
  }),

  // GET /api/products/:id - Obtener producto por ID
  http.get('/api/products/:id', ({ params }) => {
    const { id } = params;
    const product = mockProducts.find(p => p.id === id);

    if (!product) {
      return HttpResponse.json({
        error: 'Product not found',
        message: `Producto con ID ${id} no encontrado`,
        code: 'PRODUCT_NOT_FOUND'
      }, { status: 404 });
    }

    return HttpResponse.json({
      data: product
    }, { status: 200 });
  }),

  // POST /api/products - Crear nuevo producto
  http.post('/api/products', async ({ request }) => {
    try {
      const newProductData = await request.json() as CreateProductDto;

      // Validaciones
      if (!newProductData.name || !newProductData.price) {
        return HttpResponse.json({
          error: 'Validation failed',
          message: 'Nombre y precio son requeridos',
          code: 'VALIDATION_ERROR',
          details: {
            fields: {
              name: !newProductData.name ? 'Name is required' : null,
              price: !newProductData.price ? 'Price is required' : null
            }
          }
        }, { status: 400 });
      }

      // Crear nuevo producto
      const newProduct: ProductDto = {
        id: `prod-${Date.now()}`,
        name: newProductData.name,
        description: newProductData.description || '',
        price: createPrice(newProductData.price, newProductData.currency || 'PEN'),
        stock: newProductData.stock || 0,
        category: newProductData.category || 'general',
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockProducts.push(newProduct);

      return HttpResponse.json({
        data: newProduct,
        message: 'Producto creado exitosamente'
      }, { status: 201 });

    } catch (error) {
      return HttpResponse.json({
        error: 'Internal server error',
        message: 'Error procesando la solicitud',
        code: 'INTERNAL_ERROR'
      }, { status: 500 });
    }
  }),

  // POST /api/products/:id/reserve - Reservar stock de producto
  http.post('/api/products/:id/reserve', async ({ params, request }) => {
    const { id } = params;
    const productIndex = mockProducts.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return HttpResponse.json({
        error: 'Product not found',
        message: `Producto con ID ${id} no encontrado`,
        code: 'PRODUCT_NOT_FOUND'
      }, { status: 404 });
    }

    try {
      const { quantity, userId } = await request.json() as { quantity: number; userId: string };

      const product = mockProducts[productIndex];

      // Validar stock disponible
      if (product.stock < quantity) {
        return HttpResponse.json({
          error: 'Insufficient stock',
          message: `Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${quantity}`,
          code: 'INSUFFICIENT_STOCK',
          data: {
            available: product.stock,
            requested: quantity
          }
        }, { status: 409 });
      }

      // Validar que el producto esté activo
      if (!product.isAvailable) {
        return HttpResponse.json({
          error: 'Product inactive',
          message: 'No se puede reservar un producto inactivo',
          code: 'PRODUCT_INACTIVE'
        }, { status: 400 });
      }

      // Simular procesamiento (puede fallar 5% de las veces)
      if (Math.random() < 0.05) {
        return HttpResponse.json({
          error: 'Reservation failed',
          message: 'Error temporal del sistema. Intente nuevamente.',
          code: 'SYSTEM_ERROR'
        }, { status: 503 });
      }

      // Actualizar stock
      mockProducts[productIndex] = {
        ...product,
        stock: product.stock - quantity,
        updatedAt: new Date().toISOString()
      };

      const reservation = {
        id: `res-${Date.now()}`,
        productId: id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price.amount * quantity,
        userId,
        status: 'confirmed',
        reservedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      };

      return HttpResponse.json({
        data: {
          reservation,
          product: mockProducts[productIndex]
        },
        message: `Reserva confirmada por ${quantity} unidades`
      }, { status: 200 });

    } catch (error) {
      return HttpResponse.json({
        error: 'Internal server error', 
        message: 'Error procesando la reserva',
        code: 'INTERNAL_ERROR'
      }, { status: 500 });
    }
  }),

  // GET /api/products/categories - Obtener categorías disponibles
  http.get('/api/products/categories', () => {
    const categories = [...new Set(mockProducts.map(p => p.category))];
    
    const categoriesWithCount = categories.map(category => ({
      id: category,
      name: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Sin categoría',
      count: mockProducts.filter(p => p.category === category && p.isAvailable).length
    }));

    return HttpResponse.json({
      data: categoriesWithCount
    }, { status: 200 });
  }),

  // GET /api/products/stats - Estadísticas de productos
  http.get('/api/products/stats', () => {
    const activeProducts = mockProducts.filter(p => p.isAvailable);
    const totalValue = activeProducts.reduce((sum, p) => sum + (p.price.amount * p.stock), 0);
    const lowStockProducts = activeProducts.filter(p => p.stock <= 5);

    const stats = {
      total: mockProducts.length,
      active: activeProducts.length,
      inactive: mockProducts.length - activeProducts.length,
      totalInventoryValue: totalValue,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: activeProducts.filter(p => p.stock === 0).length,
      averagePrice: activeProducts.reduce((sum, p) => sum + p.price.amount, 0) / activeProducts.length,
      categoriesCount: [...new Set(activeProducts.map(p => p.category))].length
    };

    return HttpResponse.json({
      data: stats
    }, { status: 200 });
  })
];