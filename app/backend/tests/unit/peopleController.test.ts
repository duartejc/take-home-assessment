import { peopleController } from '../../src/controllers/peopleController';
import { swapiService } from '../../src/services/swapiService';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock the swapiService
jest.mock('../../src/services/swapiService');
const mockedSwapiService = swapiService as jest.Mocked<typeof swapiService>;

describe('PeopleController', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create mock request, response, and next function
    mockReq = {
      params: {},
      query: {},
      body: {},
      headers: {},
      method: 'GET',
      url: '/',
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
      acceptsEncodings: jest.fn(),
      acceptsLanguages: jest.fn(),
      param: jest.fn(),
      is: jest.fn(),
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
    }
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis()
    }
    mockNext = jest.fn();
  });

  describe('getPersonById', () => {
    it('should return 400 if ID parameter is missing', async () => {
      // Arrange
      mockReq.params = {};

      // Act
      await peopleController.getPersonById(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'ID parameter is required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 if ID parameter is empty string', async () => {
      // Act
      await peopleController.getPersonById(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'ID parameter is required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 if ID parameter is whitespace only', async () => {
      // Arrange
      mockReq.params = { id: '   ' };

      // Act
      await peopleController.getPersonById(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'ID parameter must be a non-empty string'
      });
      expect(mockedSwapiService.getPersonById).not.toHaveBeenCalled();
    });

    it('should call swapiService with correct ID and return person data', async () => {
      // Arrange
      const mockPerson = {
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: 'https://swapi.dev/api/planets/1/',
        films: [],
        species: [],
        vehicles: [],
        starships: [],
        created: '2014-12-09T13:50:51.644000Z',
        edited: '2014-12-20T21:17:56.891000Z',
        url: 'https://swapi.dev/api/people/1/'
      };

      mockReq.params = { id: '1' };
      mockedSwapiService.getPersonById.mockResolvedValue(mockPerson);

      // Act
      await peopleController.getPersonById(mockReq, mockRes);

      // Assert
      expect(mockedSwapiService.getPersonById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockPerson);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 404 when swapiService throws 404 error', async () => {
      // Arrange
      const error = new Error('Person not found');
      (error as any).response = { status: 404 };
      
      mockReq.params = { id: '999' };
      mockedSwapiService.getPersonById.mockRejectedValue(error);

      // Act
      await peopleController.getPersonById(mockReq, mockRes);

      // Assert
      expect(mockedSwapiService.getPersonById).toHaveBeenCalledWith('999');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Not Found',
        message: 'Person with ID 999 not found'
      });
    });

    it('should return 500 when swapiService throws generic error', async () => {
      // Arrange
      const error = new Error('Network error');
      
      mockReq.params = { id: '1' };
      mockedSwapiService.getPersonById.mockRejectedValue(error);

      // Act
      await peopleController.getPersonById(mockReq, mockRes);

      // Assert
      expect(mockedSwapiService.getPersonById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
        message: 'Failed to retrieve person data'
      });
    });

    it('should handle valid string ID with numbers', async () => {
      // Arrange
      const mockPerson = {
        name: 'Darth Vader',
        height: '202',
        mass: '136',
        hair_color: 'none',
        skin_color: 'white',
        eye_color: 'yellow',
        birth_year: '41.9BBY',
        gender: 'male',
        homeworld: 'https://swapi.dev/api/planets/1/',
        films: [],
        species: [],
        vehicles: [],
        starships: [],
        created: '2014-12-10T15:18:20.704000Z',
        edited: '2014-12-20T21:17:50.313000Z',
        url: 'https://swapi.dev/api/people/4/'
      };

      mockReq.params = { id: '4' };
      mockedSwapiService.getPersonById.mockResolvedValue(mockPerson);

      // Act
      await peopleController.getPersonById(mockReq, mockRes);

      // Assert
      expect(mockedSwapiService.getPersonById).toHaveBeenCalledWith('4');
      expect(mockRes.json).toHaveBeenCalledWith(mockPerson);
    });

    it('should handle valid string ID with leading zeros', async () => {
      // Arrange
      const mockPerson = {
        name: 'C-3PO',
        height: '167',
        mass: '75',
        hair_color: 'n/a',
        skin_color: 'gold',
        eye_color: 'yellow',
        birth_year: '112BBY',
        gender: 'n/a',
        homeworld: 'https://swapi.dev/api/planets/1/',
        films: [],
        species: [],
        vehicles: [],
        starships: [],
        created: '2014-12-10T15:10:51.357000Z',
        edited: '2014-12-20T21:17:50.309000Z',
        url: 'https://swapi.dev/api/people/2/'
      };

      mockReq.params = { id: '02' };
      mockedSwapiService.getPersonById.mockResolvedValue(mockPerson);

      // Act
      await peopleController.getPersonById(mockReq, mockRes);

      // Assert
      expect(mockedSwapiService.getPersonById).toHaveBeenCalledWith('02');
      expect(mockRes.json).toHaveBeenCalledWith(mockPerson);
    });
  });
});
