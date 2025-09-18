import { searchController } from '../../src/controllers/searchController';
import { swapiService } from '../../src/services/swapiService';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock the swapiService
jest.mock('../../src/services/swapiService');
const mockedSwapiService = swapiService as jest.Mocked<typeof swapiService>;

describe('SearchController', () => {
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

  describe('search', () => {
    it('should return 400 if query parameter is missing', async () => {
      // Arrange
      mockReq.query = {};

      // Act
      await searchController.search(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'Query parameter is required'
      });
      expect(mockedSwapiService.search).not.toHaveBeenCalled();
    });

    it('should return 400 if query parameter is empty string', async () => {
      // Arrange
      mockReq.query = { query: '' };

      // Act
      await searchController.search(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'Query parameter is required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 if query parameter is whitespace only', async () => {
      // Arrange
      mockReq.query = { query: '   ' };

      // Act
      await searchController.search(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'Query parameter must be a non-empty string'
      });
      expect(mockedSwapiService.search).not.toHaveBeenCalled();
    });

    it('should handle empty search results', async () => {
      // Arrange
      const mockSearchResults = {
        people: [],
        films: [],
        starships: [],
        vehicles: [],
        species: [],
        planets: []
      };

      mockReq.query = { query: 'nonexistent' };
      mockedSwapiService.search.mockResolvedValue(mockSearchResults);

      // Act
      await searchController.search(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.search).toHaveBeenCalledWith('nonexistent');
      expect(mockRes.json).toHaveBeenCalledWith({
        query: 'nonexistent',
        totalResults: 0,
        results: mockSearchResults,
        timestamp: expect.any(String)
      });
    });

    it('should pass error to next middleware when swapiService throws error', async () => {
      // Arrange
      const error = new Error('Service unavailable');
      mockReq.query = { query: 'test' };
      mockedSwapiService.search.mockRejectedValue(error);

      // Act
      await searchController.search(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.search).toHaveBeenCalledWith('test');
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  describe('searchByCategory', () => {
    it('should return 400 if query parameter is missing', async () => {
      // Arrange
      mockReq.params = { category: 'people' };
      mockReq.query = {};

      // Act
      await searchController.searchByCategory(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'Query parameter is required'
      });
      expect(mockedSwapiService.searchPeople).not.toHaveBeenCalled();
    });

    it('should return 400 if query parameter is not a string', async () => {
      // Arrange
      mockReq.params = { category: 'people' };
      mockReq.query = { query: 123 };

      // Act
      await searchController.searchByCategory(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'Query parameter must be a string'
      });
      expect(mockedSwapiService.searchPeople).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid category', async () => {
      // Arrange
      mockReq.params = { category: 'invalid' };
      mockReq.query = { query: 'test' };

      // Act
      await searchController.searchByCategory(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'Invalid category. Valid categories are: people, films, starships, vehicles, species, planets'
      });
      expect(mockedSwapiService.searchPeople).not.toHaveBeenCalled();
    });

    it('should call searchPeople for people category', async () => {
      // Arrange
      const mockPeople = [{
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: '',
        films: [],
        species: [],
        vehicles: [],
        starships: [],
        created: '',
        edited: '',
        url: ''
      }];
      mockReq.params = { category: 'people' };
      mockReq.query = { query: 'Luke' };
      mockedSwapiService.searchPeople.mockResolvedValue(mockPeople);

      // Act
      await searchController.searchByCategory(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.searchPeople).toHaveBeenCalledWith('Luke');
      expect(mockRes.json).toHaveBeenCalledWith({
        category: 'people',
        query: 'Luke',
        totalResults: 1,
        results: mockPeople,
        timestamp: expect.any(String)
      });
    });

    it('should call searchFilms for films category', async () => {
      // Arrange
      const mockFilms = [{
        title: 'A New Hope',
        episode_id: 4,
        opening_crawl: '',
        director: '',
        producer: '',
        release_date: '',
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        created: '',
        edited: '',
        url: ''
      }];
      mockReq.params = { category: 'films' };
      mockReq.query = { query: 'Hope' };
      mockedSwapiService.searchFilms.mockResolvedValue(mockFilms);

      // Act
      await searchController.searchByCategory(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.searchFilms).toHaveBeenCalledWith('Hope');
      expect(mockRes.json).toHaveBeenCalledWith({
        category: 'films',
        query: 'Hope',
        totalResults: 1,
        results: mockFilms,
        timestamp: expect.any(String)
      });
    });

    it('should handle empty results for category search', async () => {
      // Arrange
      mockReq.params = { category: 'people' };
      mockReq.query = { query: 'nonexistent' };
      mockedSwapiService.searchPeople.mockResolvedValue([]);

      // Act
      await searchController.searchByCategory(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.searchPeople).toHaveBeenCalledWith('nonexistent');
      expect(mockRes.json).toHaveBeenCalledWith({
        category: 'people',
        query: 'nonexistent',
        totalResults: 0,
        results: [],
        timestamp: expect.any(String)
      });
    });

    it('should pass error to next middleware when service method throws error', async () => {
      // Arrange
      const error = new Error('Service unavailable');
      mockReq.params = { category: 'people' };
      mockReq.query = { query: 'test' };
      mockedSwapiService.searchPeople.mockRejectedValue(error);

      // Act
      await searchController.searchByCategory(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.searchPeople).toHaveBeenCalledWith('test');
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });
});
