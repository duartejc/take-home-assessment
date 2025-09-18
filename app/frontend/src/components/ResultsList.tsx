import { Button } from '@/components/ui/button';
import { Person, Film } from '@swstarter/shared';
import { ApiService } from '@/services/api';
import { Separator } from '@/components/ui/separator';

interface ResultsListProps {
  results: (Person | Film)[];
  type: 'people' | 'films';
  isLoading: boolean;
  onItemClick: (id: string, type: 'people' | 'films') => void;
}

export function ResultsList({ results, type, isLoading, onItemClick }: ResultsListProps) {
  if (isLoading) {
    return (
      <div className="bg-card p-6 rounded-xs shadow-sm border h-96">
        <h2 className="text-lg font-semibold mb-4 border-b">Results</h2>
        <Separator />
        <div className="text-center py-8 font-montserrat text-md font-bold text-pinkish-grey h-full flex flex-col items-center justify-center">
          Searching...
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-card p-6 rounded-xs shadow-sm border h-96">
        <h2 className="text-lg font-semibold mb-4">Results</h2>
        <Separator />
        <div className="text-center py-8 font-montserrat text-md font-bold text-pinkish-grey h-full flex flex-col items-center justify-center">
          <p>There are zero matches.</p>
          <p>Use the form to search for People or Movies.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">Results</h2>
      <Separator />
      <div className="space-y-3">
        {results.map((item, index) => {
          const name = 'name' in item ? item.name : item.title;
          const id = ApiService.extractIdFromUrl(item.url);
          
          return (
            <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
              <h3 className="font-montserrat text-md font-bold text-[#000]">{name}</h3>
              <Button
                onClick={() => onItemClick(id, type)}
                size="sm"
                className="px-6 font-montserrat font-bold text-[#fff] bg-green-teal rounded-full"
              >
                SEE DETAILS
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}