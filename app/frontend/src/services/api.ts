import { ApiSearchResponse, StatsResponse, Person, Film } from '@swstarter/shared';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiService {
  static async search(query: string): Promise<ApiSearchResponse> {
    const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  static async getStats(): Promise<StatsResponse> {
    const response = await fetch(`${API_BASE_URL}/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  static async getPersonById(id: string): Promise<Person> {
    const response = await fetch(`${API_BASE_URL}/people/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  static async getFilmById(id: string): Promise<Film> {
    const response = await fetch(`${API_BASE_URL}/films/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  static async getCharacterByUrl(url: string): Promise<Person> {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  static async getFilmByUrl(url: string): Promise<Film> {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  static extractIdFromUrl(url: string): string {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? matches[1] : '';
  }
}
