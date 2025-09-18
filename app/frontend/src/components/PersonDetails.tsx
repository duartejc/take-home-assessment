import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Person, Film } from '@swstarter/shared';
import { ApiService } from '@/services/api';

interface PersonDetailsProps {
  person: Person;
  onBack: () => void;
  onMovieClick: (id: string) => void;
}

export function PersonDetails({ person, onBack, onMovieClick }: PersonDetailsProps) {
  const [films, setFilms] = useState<Film[]>([]);

  useEffect(() => {
    const loadFilms = async () => {
      try {
        const filmPromises = person.films.map(url => ApiService.getFilmByUrl(url));
        const filmResults = await Promise.all(filmPromises);
        setFilms(filmResults);
      } catch (error) {
        console.error('Error loading films:', error);
      }
    };

    loadFilms();
  }, [person.films]);

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{person.name}</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Details</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Birth Year:</span> {person.birth_year}</p>
            <p><span className="font-medium">Gender:</span> {person.gender}</p>
            <p><span className="font-medium">Eye Color:</span> {person.eye_color}</p>
            <p><span className="font-medium">Hair Color:</span> {person.hair_color}</p>
            <p><span className="font-medium">Height:</span> {person.height}</p>
            <p><span className="font-medium">Mass:</span> {person.mass}</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Movies</h2>
          <div className="space-y-2">
            {films.map((film) => {
              const filmId = ApiService.extractIdFromUrl(film.url);
              return (
                <button
                  key={film.url}
                  onClick={() => onMovieClick(filmId)}
                  className="text-accent hover:underline text-left block"
                >
                  {film.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Button onClick={onBack} className="px-8 font-montserrat font-bold text-[#fff] bg-green-teal rounded-full">
          BACK TO SEARCH
        </Button>
      </div>
    </div>
  );
}