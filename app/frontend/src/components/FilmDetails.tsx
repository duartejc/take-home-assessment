import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Film, Person } from '@swstarter/shared';
import { ApiService } from '@/services/api';

interface FilmDetailsProps {
  film: Film;
  onBack: () => void;
  onCharacterClick: (id: string) => void;
}

export function FilmDetails({ film, onBack, onCharacterClick }: FilmDetailsProps) {
  const [characters, setCharacters] = useState<Person[]>([]);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const characterPromises = film.characters.map(url => ApiService.getCharacterByUrl(url));
        const characterResults = await Promise.all(characterPromises);
        setCharacters(characterResults);
      } catch (error) {
        console.error('Error loading characters:', error);
      }
    };

    loadCharacters();
  }, [film.characters]);

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{film.title}</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Opening Crawl</h2>
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {film.opening_crawl}
          </p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Characters</h2>
          <div className="space-y-1">
            {characters.map((character) => {
              const characterId = ApiService.extractIdFromUrl(character.url);
              return (
                <button
                  key={character.url}
                  onClick={() => onCharacterClick(characterId)}
                  className="text-accent hover:underline text-left block text-sm"
                >
                  {character.name}
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