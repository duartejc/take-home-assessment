import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SearchForm } from '@/components/SearchForm';
import { ResultsList } from '@/components/ResultsList';
import { PersonDetails } from '@/components/PersonDetails';
import { FilmDetails } from '@/components/FilmDetails';
import { ApiService } from '@/services/api';
import { Person, Film, SearchResponse, ApiSearchResponse } from '@swstarter/shared';

const Index = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [searchResults, setSearchResults] = useState<(Person | Film)[]>([]);
  const [apiSearchResults, setApiSearchResults] = useState<ApiSearchResponse | null>(null);
  const [searchType, setSearchType] = useState<'people' | 'films'>('people');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [currentFilm, setCurrentFilm] = useState<Film | null>(null);
  
  // Determine current view
  const isPersonView = location.pathname.includes('/person/');
  const isFilmView = location.pathname.includes('/film/');
  const isSearchView = !isPersonView && !isFilmView;

  // Load person or film details when URL changes
  useEffect(() => {
    if (id) {
      if (isPersonView) {
        loadPerson(id);
      } else if (isFilmView) {
        loadFilm(id);
      }
    }
  }, [id, isPersonView, isFilmView]);

  // Clean up Results state when loading Index (search view)
  useEffect(() => {
    if (isSearchView) {
      setSearchResults([]);
      setApiSearchResults(null);
      setCurrentPerson(null);
      setCurrentFilm(null);
    }
  }, [isSearchView]);

  const loadPerson = async (personId: string) => {
    try {
      setIsLoading(true);
      const person = await ApiService.getPersonById(personId);
      setCurrentPerson(person);
    } catch (error) {
      console.error('Error loading person:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFilm = async (filmId: string) => {
    try {
      setIsLoading(true);
      const film = await ApiService.getFilmById(filmId);
      setCurrentFilm(film);
    } catch (error) {
      console.error('Error loading film:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string, type: 'people' | 'films') => {
    setIsLoading(true);
    setSearchType(type);
    
    try {
      const apiResponse = await ApiService.search(query);
      setApiSearchResults(apiResponse);
      
      if (type === 'people') {
        setSearchResults(apiResponse.results.people);
      } else {
        setSearchResults(apiResponse.results.films);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
      setApiSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (itemId: string, type: 'people' | 'films') => {
    const path = type === 'people' ? `/person/${itemId}` : `/film/${itemId}`;
    navigate(path);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleMovieClick = (filmId: string) => {
    navigate(`/film/${filmId}`);
  };

  const handleCharacterClick = (personId: string) => {
    navigate(`/person/${personId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b py-4">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-primary">SWStarter</h1>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {isSearchView && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="col-span-1 lg:col-span-1">
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            </div>
            <div className="col-span-2 lg:col-span-2">
              <ResultsList
                results={searchResults}
                type={searchType}
                isLoading={isLoading}
                onItemClick={handleItemClick}
              />
            </div>
          </div>
        )}

        {isPersonView && currentPerson && !isLoading && (
          <PersonDetails
            person={currentPerson}
            onBack={handleBack}
            onMovieClick={handleMovieClick}
          />
        )}

        {isFilmView && currentFilm && !isLoading && (
          <FilmDetails
            film={currentFilm}
            onBack={handleBack}
            onCharacterClick={handleCharacterClick}
          />
        )}

        {(isPersonView || isFilmView) && isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
