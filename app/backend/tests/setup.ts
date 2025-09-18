// Test setup file
import 'module-alias/register';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

// Mock external services
jest.mock('axios');

// Set test timeout
jest.setTimeout(10000);

// Simple mock types
type MockRequest = {
  query: Record<string, any>;
  params: Record<string, any>;
  body: Record<string, any>;
  headers: Record<string, any>;
  method: string;
  url: string;
  // Basic Express Request methods
  get: (name: string) => any;
  header: (name: string) => any;
  accepts: (types: string[]) => string[];
  acceptsCharsets: (charsets: string[]) => string[];
  acceptsEncodings: (encodings: string[]) => string[];
  acceptsLanguages: (langs: string[]) => string[];
  param: (name: string, defaultValue?: any) => any;
  is: (type: string) => string | false;
  // Basic Express Request properties
  protocol: string;
  secure: boolean;
  ip: string;
  ips: string[];
  subdomains: string[];
  path: string;
  hostname: string;
  fresh: boolean;
  stale: boolean;
  xhr: boolean;
  app: any;
  baseUrl: string;
  originalUrl: string;
  cookies: any;
  signedCookies: any;
  route: any;
};

type MockResponse = {
  status: jest.Mock;
  json: jest.Mock;
  send: jest.Mock;
  end: jest.Mock;
};

// Simple mock utilities
const createMockRequest = (query: Record<string, any> = {}, params: Record<string, any> = {}, body: Record<string, any> = {}): MockRequest => ({
  query,
  params,
  body,
  headers: {},
  method: 'GET',
  url: '/',
  // Basic Express Request methods
  get: jest.fn((name: string) => undefined),
  header: jest.fn((name: string) => undefined),
  accepts: jest.fn(() => ['application/json']),
  acceptsCharsets: jest.fn(() => ['utf-8']),
  acceptsEncodings: jest.fn(() => ['gzip', 'deflate']),
  acceptsLanguages: jest.fn(() => ['en']),
  param: jest.fn((name: string, defaultValue?: any) => params[name] || defaultValue),
  is: jest.fn((type: string) => type === 'application/json' ? 'application/json' : false),
  // Basic Express Request properties
  protocol: 'http',
  secure: false,
  ip: '127.0.0.1',
  ips: ['127.0.0.1'],
  subdomains: [],
  path: '/',
  hostname: 'localhost',
  fresh: true,
  stale: false,
  xhr: false,
  app: {},
  baseUrl: '',
  originalUrl: '/',
  cookies: {},
  signedCookies: {},
  route: {}
});

const createMockResponse = (): MockResponse => {
  const res = {} as MockResponse;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

const createMockNext = (): jest.Mock => jest.fn();

// Export utilities
export {
  MockRequest,
  MockResponse,
  createMockRequest,
  createMockResponse,
  createMockNext
};

// Also set as global for backward compatibility
(global as any).createMockRequest = createMockRequest;
(global as any).createMockResponse = createMockResponse;
(global as any).createMockNext = createMockNext;

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
