export function createMockRequest(query?: any, params?: any, body?: any): any;
export function createMockResponse(): any;

// Global declarations for backward compatibility
declare global {
  function createMockRequest(query?: any, params?: any, body?: any): any;
  function createMockResponse(): any;
}
