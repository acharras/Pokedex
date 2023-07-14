import "./searchBar.css"
import { useState } from 'react'

interface PokemonSearchProps {
    onSearch: (searchTerm: string) => void;
}

export function SearchBar({ onSearch }:PokemonSearchProps) {
    
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <div className="SearchBar">
            <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Entrer un nom de Pokémon"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button type="submit">Rechercher</button>
            </form>
        </div>
    );
};