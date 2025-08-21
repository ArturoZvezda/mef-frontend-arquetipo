// Infrastructure Layer - Adaptadores concretos
export * from './lib/http';
export * from './lib/storage';
export * from './lib/notification';
export * from './lib/logging';
export * from './lib/event-bus';

// Re-export para facilitar imports
export * from './lib/http/http-client.service';
export * from './lib/http/http-user.repository';
export * from './lib/http/http-product.repository';
export * from './lib/storage/storage.service';
export * from './lib/storage/local-storage-user.repository';
export * from './lib/storage/local-storage-product.repository';
export * from './lib/notification/console-notification.adapter';
export * from './lib/notification/toast-notification.adapter';
export * from './lib/notification/email-notification.adapter';
export * from './lib/logging/console-logging.adapter';
export * from './lib/event-bus/rxjs-event-bus.adapter';
