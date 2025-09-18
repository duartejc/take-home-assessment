import { searchController } from '@/controllers/searchController';
import { swapiService } from '@/services/swapiService';
import { createMockRequest, createMockResponse } from '../setup';

// Mock the swapiService
jest.mock('@/services/swapiService');
const mockedSwapiService = swapiService as jest.Mocked<typeof swapiService>;

describe('SearchController', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create mock request, response, and next function
    mockReq = createMockRequest();
    mockRes = createMockResponse();
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
      const mockReq = createMockRequest({ query: '' });
      const mockRes = createMockResponse();

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

    it('should call swapiService with trimmed query and return formatted response', async () => {
      // Arrange
      const mockSearchResults = {
        people: [{
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
        }],
        films: [{
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
        }],
        starships: [{ name: 'X-wing' }],
        vehicles: [{ name: 'Sand Crawler' }],
        species: [{ name: 'Human' }],
        planets: [{ name: 'Tatooine' }]
      };

      mockReq.query = { query: '  Luke  ' };
      mockedSwapiService.search.mockResolvedValue(mockSearchResults);

      // Act
      await searchController.search(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.search).toHaveBeenCalledWith('Luke');
      expect(mockRes.json).toHaveBeenCalledWith({
        query: 'Luke',
        totalResults: 6,
        results: mockSearchResults,
        timestamp: expect.any(String)
      });
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

    it('should call searchStarships for starships category', async () => {
      // Arrange
      const mockStarships = [{ name: 'X-wing' }];
      mockReq.params = { category: 'starships' };
      mockReq.query = { query: 'X-wing' };
      mockedSwapiService.searchStarships.mockResolvedValue(mockStarships);

      // Act
      await searchController.searchByCategory(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.searchStarships).toHaveBeenCalledWith('X-wing');
      expect(mockRes.json).toHaveBeenCalledWith({
        category: 'starships',
        query: 'X-wing',
        totalResults: 1,
        results: mockStarships,
        timestamp: expect.any(String)
      });
    });

    it('should call searchVehicles for vehicles category', async () => {
      // Arrange
      const mockVehicles = [{ name: 'Sand Crawler' }];
      mockReq.params = { category: 'vehicles' };
      mockReq.query = { query: 'Sand' };
      mockedSwapiService.searchVehicles.mockResolvedValue(mockVehicles);

      // Act
      await searchController.searchByCategory(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.searchVehicles).toHaveBeenCalledWith('Sand');
      expect(mockRes.json).toHaveBeenCalledWith({
        category: 'vehicles',
        query: 'Sand',
        totalResults: 1,
        results: mockVehicles,
        timestamp: expect.any(String)
      });
    });

    it('should call searchSpecies for species category', async () => {
      // Arrange
      const mockSpecies = [{ name: 'Human' }];
      mockReq.params = { category: 'species' };
      mockReq.query = { query: 'Human' };
      mockedSwapiService.searchSpecies.mockResolvedValue(mockSpecies);

      // Act
      await searchController.searchByCategory(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.searchSpecies).toHaveBeenCalledWith('Human');
      expect(mockRes.json).toHaveBeenCalledWith({
        category: 'species',
        query: 'Human',
        totalResults: 1,
        results: mockSpecies,
        timestamp: expect.any(String)
      });
    });

    it('should call searchPlanets for planets category', async () => {
      // Arrange
      const mockPlanets = [{ name: 'Tatooine' }];
      mockReq.params = { category: 'planets' };
      mockReq.query = { query: 'Tatooine' };
      mockedSwapiService.searchPlanets.mockResolvedValue(mockPlanets);

      // Act
      await searchController.searchByCategory(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.searchPlanets).toHaveBeenCalledWith('Tatooine');
      expect(mockRes.json).toHaveBeenCalledWith({
        category: 'planets',
        query: 'Tatooine',
        totalResults: 1,
        results: mockPlanets,
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

    it('should trim query parameter for category search', async () => {
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
      mockReq.query = { query: '  Luke  ' };
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
