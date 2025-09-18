import axios from 'axios';
import { swapiService } from '@/services/swapiService';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SwapiService', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create mock axios instance
    mockAxiosInstance = {
      get: jest.fn(),
    };
    
    // Mock axios.create to return our mock instance
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    
    // Reset environment variables
    process.env.SWAPI_BASE_URL = 'https://swapi.dev/api';
    process.env.SWAPI_TIMEOUT = '5000';
    
    // Directly replace the axios instance on the service
    (swapiService as any).axios = mockAxiosInstance;
  });

  describe('searchPeople', () => {
    it('should return people results from API', async () => {
      // Arrange
      const mockPeople = [
        {
          name: 'Luke Skywalker',
          height: '172',
          mass: '77',
          hair_color: 'blond',
          skin_color: 'fair',
          eye_color: 'blue',
          birth_year: '19BBY',
          gender: 'male',
        }
      ];

      mockAxiosInstance.get.mockResolvedValue({
        data: { results: mockPeople }
      });

      // Act
      const result = await swapiService.searchPeople('Luke');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/people/', {
        params: { search: 'Luke' }
      });
      expect(result).toEqual(mockPeople);
    });

    it('should return empty array when API call fails', async () => {
      // Arrange
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      // Act
      const result = await swapiService.searchPeople('Luke');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/people/', {
        params: { search: 'Luke' }
      });
      expect(result).toEqual([]);
    });
  });

  describe('searchFilms', () => {
    it('should return film results from API', async () => {
      // Arrange
      const mockFilms = [
        {
          title: 'A New Hope',
          episode_id: 4,
          opening_crawl: 'It is a period of civil war...',
          director: 'George Lucas',
          producer: 'Gary Kurtz',
          release_date: '1977-05-25',
        }
      ];

      mockAxiosInstance.get.mockResolvedValue({
        data: { results: mockFilms }
      });

      // Act
      const result = await swapiService.searchFilms('Hope');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/films/', {
        params: { search: 'Hope' }
      });
      expect(result).toEqual(mockFilms);
    });

    it('should return empty array when API call fails', async () => {
      // Arrange
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      // Act
      const result = await swapiService.searchFilms('Hope');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/films/', {
        params: { search: 'Hope' }
      });
      expect(result).toEqual([]);
    });
  });

  describe('getFilmById', () => {
    it('should return film data for valid ID', async () => {
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

      mockAxiosInstance.get.mockResolvedValue({
        data: mockFilm
      });

      // Act
      const result = await swapiService.getFilmById('1');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/films/1/');
      expect(result).toEqual(mockFilm);
    });

    it('should throw error when API call fails', async () => {
      // Arrange
      const error = new Error('Film not found');
      mockAxiosInstance.get.mockRejectedValue(error);

      // Act & Assert
      await expect(swapiService.getFilmById('999')).rejects.toThrow('Film not found');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/films/999/');
    });
  });

  describe('getPersonById', () => {
    it('should return person data for valid ID', async () => {
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

      mockAxiosInstance.get.mockResolvedValue({
        data: mockPerson
      });

      // Act
      const result = await swapiService.getPersonById('1');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/people/1/');
      expect(result).toEqual(mockPerson);
    });

    it('should throw error when API call fails', async () => {
      // Arrange
      const error = new Error('Person not found');
      mockAxiosInstance.get.mockRejectedValue(error);

      // Act & Assert
      await expect(swapiService.getPersonById('999')).rejects.toThrow('Person not found');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/people/999/');
    });
  });

});
