import axios from 'axios';
import { swapiService } from '@/services/swapiService';

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

  describe('searchStarships', () => {
    it('should return starship results from API', async () => {
      // Arrange
      const mockStarships = [
        {
          name: 'X-wing',
          model: 'T-65 X-wing',
          manufacturer: 'Incom Corporation',
          cost_in_credits: '149999',
          length: '12.5',
        }
      ];

      mockAxiosInstance.get.mockResolvedValue({
        data: { results: mockStarships }
      });

      // Act
      const result = await swapiService.searchStarships('X-wing');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/starships/', {
        params: { search: 'X-wing' }
      });
      expect(result).toEqual(mockStarships);
    });

    it('should return empty array when API call fails', async () => {
      // Arrange
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      // Act
      const result = await swapiService.searchStarships('X-wing');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/starships/', {
        params: { search: 'X-wing' }
      });
      expect(result).toEqual([]);
    });
  });

  describe('searchVehicles', () => {
    it('should return vehicle results from API', async () => {
      // Arrange
      const mockVehicles = [
        {
          name: 'Sand Crawler',
          model: 'Digger Crawler',
          manufacturer: 'Corellia Mining Corporation',
          cost_in_credits: '150000',
          length: '36.8',
        }
      ];

      mockAxiosInstance.get.mockResolvedValue({
        data: { results: mockVehicles }
      });

      // Act
      const result = await swapiService.searchVehicles('Sand');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/vehicles/', {
        params: { search: 'Sand' }
      });
      expect(result).toEqual(mockVehicles);
    });

    it('should return empty array when API call fails', async () => {
      // Arrange
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      // Act
      const result = await swapiService.searchVehicles('Sand');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/vehicles/', {
        params: { search: 'Sand' }
      });
      expect(result).toEqual([]);
    });
  });

  describe('searchSpecies', () => {
    it('should return species results from API', async () => {
      // Arrange
      const mockSpecies = [
        {
          name: 'Human',
          classification: 'mammal',
          designation: 'sentient',
          average_height: '180',
          skin_colors: 'caucasian, black, asian, hispanic',
        }
      ];

      mockAxiosInstance.get.mockResolvedValue({
        data: { results: mockSpecies }
      });

      // Act
      const result = await swapiService.searchSpecies('Human');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/species/', {
        params: { search: 'Human' }
      });
      expect(result).toEqual(mockSpecies);
    });

    it('should return empty array when API call fails', async () => {
      // Arrange
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      // Act
      const result = await swapiService.searchSpecies('Human');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/species/', {
        params: { search: 'Human' }
      });
      expect(result).toEqual([]);
    });
  });

  describe('searchPlanets', () => {
    it('should return planet results from API', async () => {
      // Arrange
      const mockPlanets = [
        {
          name: 'Tatooine',
          rotation_period: '23',
          orbital_period: '304',
          diameter: '10465',
          climate: 'arid',
          gravity: '1 standard',
        }
      ];

      mockAxiosInstance.get.mockResolvedValue({
        data: { results: mockPlanets }
      });

      // Act
      const result = await swapiService.searchPlanets('Tatooine');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/planets/', {
        params: { search: 'Tatooine' }
      });
      expect(result).toEqual(mockPlanets);
    });

    it('should return empty array when API call fails', async () => {
      // Arrange
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      // Act
      const result = await swapiService.searchPlanets('Tatooine');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/planets/', {
        params: { search: 'Tatooine' }
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

  describe('search', () => {
    it('should return combined search results from all resources', async () => {
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
      const mockStarships = [{ name: 'X-wing' }];
      const mockVehicles = [{ name: 'Sand Crawler' }];
      const mockSpecies = [{ name: 'Human' }];
      const mockPlanets = [{ name: 'Tatooine' }];

      // Mock all search methods
      jest.spyOn(swapiService, 'searchPeople').mockResolvedValue(mockPeople);
      jest.spyOn(swapiService, 'searchFilms').mockResolvedValue(mockFilms);
      jest.spyOn(swapiService, 'searchStarships').mockResolvedValue(mockStarships);
      jest.spyOn(swapiService, 'searchVehicles').mockResolvedValue(mockVehicles);
      jest.spyOn(swapiService, 'searchSpecies').mockResolvedValue(mockSpecies);
      jest.spyOn(swapiService, 'searchPlanets').mockResolvedValue(mockPlanets);

      // Act
      const result = await swapiService.search('test');

      // Assert
      expect(result).toEqual({
        people: mockPeople,
        films: mockFilms,
        starships: mockStarships,
        vehicles: mockVehicles,
        species: mockSpecies,
        planets: mockPlanets
      });
    });

    it('should handle partial failures in search', async () => {
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

      // Mock some successful and some failed searches
      jest.spyOn(swapiService, 'searchPeople').mockResolvedValue(mockPeople);
      jest.spyOn(swapiService, 'searchFilms').mockResolvedValue(mockFilms);
      jest.spyOn(swapiService, 'searchStarships').mockRejectedValue(new Error('Failed'));
      jest.spyOn(swapiService, 'searchVehicles').mockRejectedValue(new Error('Failed'));
      jest.spyOn(swapiService, 'searchSpecies').mockRejectedValue(new Error('Failed'));
      jest.spyOn(swapiService, 'searchPlanets').mockRejectedValue(new Error('Failed'));

      // Act
      const result = await swapiService.search('test');

      // Assert
      expect(result).toEqual({
        people: mockPeople,
        films: mockFilms,
        starships: [],
        vehicles: [],
        species: [],
        planets: []
      });
    });

    it('should return all empty arrays when all searches fail', async () => {
      // Arrange
      jest.spyOn(swapiService, 'searchPeople').mockRejectedValue(new Error('Failed'));
      jest.spyOn(swapiService, 'searchFilms').mockRejectedValue(new Error('Failed'));
      jest.spyOn(swapiService, 'searchStarships').mockRejectedValue(new Error('Failed'));
      jest.spyOn(swapiService, 'searchVehicles').mockRejectedValue(new Error('Failed'));
      jest.spyOn(swapiService, 'searchSpecies').mockRejectedValue(new Error('Failed'));
      jest.spyOn(swapiService, 'searchPlanets').mockRejectedValue(new Error('Failed'));

      // Act
      const result = await swapiService.search('test');

      // Assert
      expect(result).toEqual({
        people: [],
        films: [],
        starships: [],
        vehicles: [],
        species: [],
        planets: []
      });
    });
  });
});
