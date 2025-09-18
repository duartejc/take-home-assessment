import { Person, Film, Starship, Vehicle, Species, Planet } from './swapi';

export interface SearchResults {
  people: Person[];
  films: Film[];
  starships: Starship[];
  vehicles: Vehicle[];
  species: Species[];
  planets: Planet[];
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
    queryStats: {
      topQueries: Array<{ query: string; count: number; percentage: number }>;
      averageResponseTime: number;
      popularHours: Array<{ hour: number; count: number; percentage: number }>;
      totalQueries: number;
      lastComputed: string | null;
    };
    lastUpdated: string;
  };
  timestamp: string;
}
