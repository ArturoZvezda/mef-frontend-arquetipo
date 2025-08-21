import { 
  CreateUserCommand,
  UpdateUserCommand,
  DeleteUserCommand,
  CreateProductCommand,
  UpdateProductCommand,
  ReserveProductStockCommand,
  UserDto,
  ProductDto,
  ProductReservationDto
} from '@mef-frontend-arquetipo/application';
import { queryKeys, invalidationHelpers } from './query-keys';

/**
 * Mutation Options para Users
 * Configuraciones para operaciones de escritura de usuarios
 */
export const userMutations = {
  /**
   * Mutation para crear usuario
   */
  create: () => ({
    meta: {
      successMessage: 'User created successfully',
      errorMessage: 'Failed to create user',
    },
    // Invalidar cache después de crear
    onSuccess: (data: UserDto) => {
      return {
        invalidateQueries: [
          invalidationHelpers.invalidateUserLists(),
        ],
        updateQueries: [
          {
            queryKey: queryKeys.users.detail(data.id),
            updater: () => data,
          },
        ],
      };
    },
  }),

  /**
   * Mutation para actualizar usuario
   */
  update: (userId: string) => ({
    meta: {
      successMessage: 'User updated successfully',
      errorMessage: 'Failed to update user',
    },
    onSuccess: (data: UserDto) => {
      return {
        invalidateQueries: [
          invalidationHelpers.invalidateUserLists(),
        ],
        updateQueries: [
          {
            queryKey: queryKeys.users.detail(userId),
            updater: () => data,
          },
        ],
      };
    },
  }),

  /**
   * Mutation para eliminar usuario
   */
  delete: (userId: string) => ({
    meta: {
      successMessage: 'User deleted successfully',
      errorMessage: 'Failed to delete user',
    },
    onSuccess: () => {
      return {
        invalidateQueries: [
          invalidationHelpers.invalidateUserLists(),
        ],
        removeQueries: [
          queryKeys.users.detail(userId),
        ],
      };
    },
  }),
};

/**
 * Mutation Options para Products
 */
export const productMutations = {
  /**
   * Mutation para crear producto
   */
  create: () => ({
    meta: {
      successMessage: 'Product created successfully',
      errorMessage: 'Failed to create product',
    },
    onSuccess: (data: ProductDto) => {
      return {
        invalidateQueries: [
          invalidationHelpers.invalidateProductLists(),
          invalidationHelpers.invalidateAvailableProducts(),
        ],
        updateQueries: [
          {
            queryKey: queryKeys.products.detail(data.id),
            updater: () => data,
          },
        ],
      };
    },
  }),

  /**
   * Mutation para actualizar producto
   */
  update: (productId: string) => ({
    meta: {
      successMessage: 'Product updated successfully',
      errorMessage: 'Failed to update product',
    },
    onSuccess: (data: ProductDto) => {
      return {
        invalidateQueries: [
          invalidationHelpers.invalidateProductLists(),
          invalidationHelpers.invalidateAvailableProducts(),
        ],
        updateQueries: [
          {
            queryKey: queryKeys.products.detail(productId),
            updater: () => data,
          },
        ],
      };
    },
  }),

  /**
   * Mutation para reservar stock
   */
  reserveStock: () => ({
    meta: {
      successMessage: 'Stock reserved successfully',
      errorMessage: 'Failed to reserve stock',
    },
    onSuccess: (data: ProductReservationDto) => {
      return {
        invalidateQueries: [
          invalidationHelpers.invalidateProduct(data.productId),
          invalidationHelpers.invalidateProductLists(),
          invalidationHelpers.invalidateAvailableProducts(),
        ],
      };
    },
    // Optimistic update para mejor UX
    onMutate: async (variables: ReserveProductStockCommand) => {
      // Cancelar queries en curso para evitar conflictos
      const productQueryKey = queryKeys.products.detail(variables.productId);
      
      return {
        rollback: {
          queryKey: productQueryKey,
        },
      };
    },
    onError: (error: any, variables: ReserveProductStockCommand, context: any) => {
      // Rollback en caso de error
      if (context?.rollback) {
        // QueryClient.setQueryData(context.rollback.queryKey, context.rollback.previousData);
      }
    },
  }),

  /**
   * Mutation para eliminar producto
   */
  delete: (productId: string) => ({
    meta: {
      successMessage: 'Product deleted successfully',
      errorMessage: 'Failed to delete product',
    },
    onSuccess: () => {
      return {
        invalidateQueries: [
          invalidationHelpers.invalidateProductLists(),
          invalidationHelpers.invalidateAvailableProducts(),
        ],
        removeQueries: [
          queryKeys.products.detail(productId),
        ],
      };
    },
  }),
};

/**
 * Mutation Options para operaciones batch
 */
export const batchMutations = {
  /**
   * Mutation para operaciones múltiples
   */
  bulkUpdate: (entityType: 'users' | 'products') => ({
    meta: {
      successMessage: `Bulk ${entityType} update completed`,
      errorMessage: `Failed to bulk update ${entityType}`,
    },
    onSuccess: () => {
      const invalidateKeys = entityType === 'users' 
        ? [invalidationHelpers.invalidateAllUsers()]
        : [invalidationHelpers.invalidateAllProducts()];
      
      return {
        invalidateQueries: invalidateKeys,
      };
    },
  }),

  /**
   * Mutation para importar datos
   */
  import: (entityType: 'users' | 'products') => ({
    meta: {
      successMessage: `${entityType} imported successfully`,
      errorMessage: `Failed to import ${entityType}`,
    },
    onSuccess: () => {
      const invalidateKeys = entityType === 'users' 
        ? [invalidationHelpers.invalidateAllUsers()]
        : [invalidationHelpers.invalidateAllProducts()];
      
      return {
        invalidateQueries: invalidateKeys,
      };
    },
  }),
};