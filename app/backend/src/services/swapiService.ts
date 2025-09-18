import { Person, Film, SearchResults } from '@swstarter/shared';
import axios, { AxiosInstance } from 'axios';

import { createLogger } from '../config/logger';

const logger = createLogger('swapi-service');
const SWAPI_BASE_URL = process.env.SWAPI_BASE_URL ?? 'https://swapi.dev/api';
const SWAPI_TIMEOUT = parseInt(process.env.SWAPI_TIMEOUT ?? '5000', 10);

class SwapiService {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: SWAPI_BASE_URL,
      timeout: SWAPI_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async search(query: string): Promise<SearchResults> {
    try {
      logger.info(`Searching SWAPI for: ${query}`);
      
      // Search across multiple resources
      const searchPromises = [
        this.searchPeople(query),
        this.searchFilms(query),
        this.searchStarships(query),
        this.searchVehicles(query),
        this.searchSpecies(query),
        this.searchPlanets(query),
      ];

      const results = await Promise.allSettled(searchPromises);
      
      const combinedResults: SearchResults = {
        people: results[0].status === 'fulfilled' ? results[0].value : [],
        films: results[1].status === 'fulfilled' ? results[1].value : [],
        starships: results[2].status === 'fulfilled' ? results[2].value : [],
        vehicles: results[3].status === 'fulfilled' ? results[3].value : [],
        species: results[4].status === 'fulfilled' ? results[4].value : [],
        planets: results[5].status === 'fulfilled' ? results[5].value : [],
      };

      logger.info(`Search completed for query: ${query}`);
      return combinedResults;
    } catch (error) {
      logger.error(`Error searching SWAPI: ${(error as Error).message}`);
      throw error;
    }
  }

  async searchPeople(query: string): Promise<Person[]> {
    try {
      const response = await this.axios.get('/people/', {
        params: { search: query }
      });
      return response.data.results;
    } catch (error) {
      logger.error(`Error searching people: ${(error as Error).message}`);
      return [];
    }
  }

  async searchFilms(query: string): Promise<Film[]> {
    try {
      const response = await this.axios.get('/films/', {
        params: { search: query }
      });
      return response.data.results;
    } catch (error) {
      logger.error(`Error searching films: ${(error as Error).message}`);
      return [];
    }
  }

  async searchStarships(query: string): Promise<any[]> {
    try {
      const response = await this.axios.get('/starships/', {
        params: { search: query }
      });
      return response.data.results;
    } catch (error) {
      logger.error(`Error searching starships: ${(error as Error).message}`);
      return [];
    }
  }

  async searchVehicles(query: string): Promise<any[]> {
    try {
      const response = await this.axios.get('/vehicles/', {
        params: { search: query }
      });
      return response.data.results;
    } catch (error) {
      logger.error(`Error searching vehicles: ${(error as Error).message}`);
      return [];
    }
  }

  async searchSpecies(query: string): Promise<any[]> {
    try {
      const response = await this.axios.get('/species/', {
        params: { search: query }
      });
      return response.data.results;
    } catch (error) {
      logger.error(`Error searching species: ${(error as Error).message}`);
      return [];
    }
  }

  async searchPlanets(query: string): Promise<any[]> {
    try {
      const response = await this.axios.get('/planets/', {
        params: { search: query }
      });
      return response.data.results;
    } catch (error) {
      logger.error(`Error searching planets: ${(error as Error).message}`);
      return [];
    }
  }

  async getFilmById(id: string): Promise<Film> {
    try {
      const response = await this.axios.get(`/films/${id}/`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching film ${id}: ${(error as Error).message}`);
      throw error;
    }
  }

  async getPersonById(id: string): Promise<Person> {
    try {
      const response = await this.axios.get(`/people/${id}/`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching person ${id}: ${(error as Error).message}`);
      throw error;
    }
  }

}

export const swapiService = new SwapiService();
