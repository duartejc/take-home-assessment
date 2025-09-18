import { filmsController } from '@/controllers/filmsController';
import { swapiService } from '@/services/swapiService';
import { createMockRequest, createMockResponse } from '../setup';

// Mock the swapiService
jest.mock('@/services/swapiService');
const mockedSwapiService = swapiService as jest.Mocked<typeof swapiService>;

describe('FilmsController', () => {
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

  describe('getFilmById', () => {
    it('should return 400 if ID parameter is missing', async () => {
      // Arrange
      mockReq.params = {};

      // Act
      await filmsController.getFilmById(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'ID parameter is required'
      });
      expect(mockedSwapiService.getFilmById).not.toHaveBeenCalled();
    });

    it('should return 400 if ID parameter is empty string', async () => {
      // Arrange
      const mockReq = createMockRequest({}, { id: '' });
      const mockRes = createMockResponse();

      // Act
      await filmsController.getFilmById(mockReq, mockRes, mockNext);

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
      await filmsController.getFilmById(mockReq, mockRes, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'ID parameter must be a non-empty string'
      });
      expect(mockedSwapiService.getFilmById).not.toHaveBeenCalled();
    });

    it('should call swapiService with correct ID and return film data', async () => {
      // Arrange
      const mockFilm = {
        title: 'A New Hope',
        episode_id: 4,
        opening_crawl: 'It is a period of civil war...',
        director: 'George Lucas',
        producer: 'Gary Kurtz',
        release_date: '1977-05-25',
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        created: '2014-12-10T14:23:31.880000Z',
        edited: '2014-12-20T19:49:45.256000Z',
        url: 'https://swapi.dev/api/films/1/'
      };

      mockReq.params = { id: '1' };
      mockedSwapiService.getFilmById.mockResolvedValue(mockFilm);

      // Act
      await filmsController.getFilmById(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.getFilmById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockFilm);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 404 when swapiService throws 404 error', async () => {
      // Arrange
      const error = new Error('Film not found');
      (error as any).response = { status: 404 };
      
      mockReq.params = { id: '999' };
      mockedSwapiService.getFilmById.mockRejectedValue(error);

      // Act
      await filmsController.getFilmById(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.getFilmById).toHaveBeenCalledWith('999');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Not Found',
        message: 'Film with ID 999 not found'
      });
    });

    it('should return 500 when swapiService throws generic error', async () => {
      // Arrange
      const error = new Error('Network error');
      
      mockReq.params = { id: '1' };
      mockedSwapiService.getFilmById.mockRejectedValue(error);

      // Act
      await filmsController.getFilmById(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.getFilmById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
        message: 'Failed to retrieve film data'
      });
    });

    it('should handle valid string ID with numbers', async () => {
      // Arrange
      const mockFilm = {
        title: 'The Empire Strikes Back',
        episode_id: 5,
        opening_crawl: 'It is a dark time for the Rebellion...',
        director: 'Irvin Kershner',
        producer: 'Gary Kurtz, Rick McCallum',
        release_date: '1980-05-17',
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        created: '2014-12-12T11:26:24.656000Z',
        edited: '2014-12-15T13:07:53.386000Z',
        url: 'https://swapi.dev/api/films/2/'
      };

      mockReq.params = { id: '2' };
      mockedSwapiService.getFilmById.mockResolvedValue(mockFilm);

      // Act
      await filmsController.getFilmById(mockReq, mockRes, mockNext);

      // Assert
      expect(mockedSwapiService.getFilmById).toHaveBeenCalledWith('2');
      expect(mockRes.json).toHaveBeenCalledWith(mockFilm);
    });
  });
});
