
import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = () => {
  return (
    <div className="hidden md:flex relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <input 
        type="text" 
        placeholder="Search..." 
        className="pl-10 py-2 pr-4 rounded-md border border-input bg-background dark:bg-sidebar-accent dark:border-sidebar-border"
      />
    </div>
  );
};

export default SearchInput;
