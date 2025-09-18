import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface SearchFormProps {
  onSearch: (query: string, type: 'people' | 'films') => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [searchType, setSearchType] = useState<'people' | 'films'>('people');
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), searchType);
    }
  };

  const isDisabled = !query.trim() || isLoading;

  return (
    <div className="bg-card p-6 rounded-xs shadow-sm border">
      <h2 className="text-md mb-4 font-montserrat font-semibold text-[#383838]">What are you searching for?</h2>
      
      <RadioGroup
        value={searchType}
        onValueChange={(value) => setSearchType(value as 'people' | 'films')}
        className="flex space-x-6 mb-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="people" id="people" className="border-emerald text-emerald data-[state=checked]:border-emerald data-[state=checked]:text-emerald" />
          <Label htmlFor="people" className="font-montserrat font-bold text-[#383838]">People</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="films" id="films" className="border-emerald text-emerald data-[state=checked]:border-emerald data-[state=checked]:text-emerald" />
          <Label htmlFor="films" className="font-montserrat font-bold text-[#383838]">Movies</Label>
        </div>
      </RadioGroup>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <Input
          type="text"
          placeholder={searchType === 'people' ? 'e.g. Chewbacca, Yoda, Boba Fett' : 'e.g. A New Hope, Empire Strikes Back'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full font-montserrat font-bold placeholder:text-pinkish-grey rounded-md shadow-[inset 0 0.5px 1.5px 0 warm-grey-75] border pinkish-grey border-solid bg-[#fff] ring-0 focus:ring-1 focus:ring-[#383838] focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-[#383838] focus-visible:ring-offset-0"
        />
        <Button
          type="submit"
          disabled={isDisabled}
          className="w-full font-montserrat font-bold text-[#fff] bg-green-teal rounded-full"
          variant={isDisabled ? "disabled" : "default"}
        >
          {isLoading ? 'SEARCHING...' : 'SEARCH'}
        </Button>
      </form>
    </div>
  );
}