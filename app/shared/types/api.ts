import { Person, Film } from './swapi';

export interface SearchResults {
  people: Person[];
  films: Film[];
  starships: any[];
  vehicles: any[];
  species: any[];
  planets: any[];
}

export interface ApiSearchResponse {
  query: string;
  totalResults: number;
  results: SearchResults;
  timestamp: string;
}

export interface StatsResponse {
  success: boolean;
  data: {
    totalResources: number;
    categoryCounts: {
      people: number;
      films: number;
      starships: number;
      vehicles: number;
      species: number;
      planets: number;
    };
    mostPopulatedCategory: {
      category: string;
      count: number;
    };
    systemInfo: {
      uptime: number;
      memoryUsage: any;
      nodeVersion: string;
      platform: string;
    };
    lastUpdated: string;
  };
  timestamp: string;
}
