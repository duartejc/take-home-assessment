// Test setup file
require('module-alias/register');

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

// Mock external services
jest.mock('axios');

// Set test timeout
jest.setTimeout(10000);

// Test utilities
const createMockRequest = (query = {}, params = {}, body = {}) => ({
  query,
  params,
  body,
  headers: {},
  method: 'GET',
  url: '/'
});

const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

// Export utilities
module.exports = {
  createMockRequest,
  createMockResponse
};

// Also set as global for backward compatibility
global.createMockRequest = createMockRequest;
global.createMockResponse = createMockResponse;

global.createMockNext = () => jest.fn();

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
