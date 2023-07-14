import "./pokemonList.css"
import axios from 'axios'
import { apiUrl } from '../../App';
import { useEffect, useState } from 'react'
import { SearchBar } from '../searchBar/searchBar';

export function PokemonList() {
    interface Pokemon {
        name: string;
        url: string;
        image: string;
        types: string[];
      }
      interface Type {
        name: string;
      }
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [pokemonPerPage, setPokemonPerPage] = useState(10);
    const [filterType, setFilterType] = useState('');
    const [typeList, setTypeList] = useState<Type[]>([]);


    const fetchPokemonList = async () => {
        try {
            if (typeList)
            {
                const typeResponse = await axios.get('https://pokeapi.co/api/v2/type/');
                const typeResults: Pokemon[] = typeResponse.data.results;

                const typeDataPromises = typeResults.map(async (type) => {
                    const typeResponse = await axios.get(type.url);
                    const { name } = typeResponse.data;
                    
                    return { name } as Type;
                })

                const typeData = await Promise.all(typeDataPromises);
                setTypeList(typeData);
            }

            const response = await axios.get(apiUrl + `pokemon?limit=1010`);
            const results: Pokemon[] = response.data.results;

            const pokemonDataPromises = results.map(async (pokemon) => {
                const pokemonResponse = await axios.get(pokemon.url);
                const { name, sprites, types } = pokemonResponse.data;
                const image = sprites.front_default;

                return { name, image, types } as Pokemon;
            });

            const pokemonData = await Promise.all(pokemonDataPromises);
            setPokemonList(pokemonData);

            if (searchTerm) {
                const filteredTotalCount = pokemonData.filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())).length;
                const totalPages = Math.ceil(filteredTotalCount / pokemonPerPage);
                setTotalPages(totalPages);
            } else {
                const totalCount = pokemonData.length;
                const totalPages = Math.ceil(totalCount / pokemonPerPage);
                setTotalPages(totalPages);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
        setCurrentPage(1);
    };

    const handlePokemonPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPokemonPerPage = parseInt(event.target.value, 10);
        setPokemonPerPage(selectedPokemonPerPage);
    };

    const handleFilterTypeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
      ) => {
        const selectedFilterType = event.target.value;
        setFilterType(selectedFilterType);
    };

    const filteredPokemonList = searchTerm
    ? pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())).filter((pokemon) =>
        filterType === '' || pokemon.types.includes(filterType)
    )
    : pokemonList.filter((pokemon) =>
        filterType === '' || pokemon.types.includes(filterType)
    );

    const startIndex = (currentPage - 1) * pokemonPerPage;
    const endIndex = startIndex + pokemonPerPage;
    const currentPokemonList = filteredPokemonList.slice(startIndex, endIndex);

    useEffect(() => {
        fetchPokemonList();
      }, []);

    useEffect(() => {
        setCurrentPage(1); 
      }, [searchTerm]);

    useEffect(() => {
        if (currentPage !== 1) {
          setCurrentPage(1);
        }

        const filteredTotalCount = filteredPokemonList.filter((pokemon) => filterType === '' || pokemon.types.includes(filterType)).length;
        const totalPages = Math.ceil(filteredTotalCount / pokemonPerPage);
        setTotalPages(totalPages);
      }, [searchTerm, filterType, pokemonPerPage]);

    return(
        <>
            <SearchBar onSearch={handleSearch}/>
            <div className="PokemonPerPage">
                <label htmlFor="pokemonPerPage">Pokémon par page:</label>
                <select
                  id="pokemonPerPage"
                  value={pokemonPerPage}
                  onChange={handlePokemonPerPageChange}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={40}>40</option>
                </select>
            </div>
            <div>
                <label htmlFor="filterType">Filtrer par type:</label>
                <select
                  id="filterType"
                  value={filterType}
                  onChange={handleFilterTypeChange}
                >
                  <option value="">Tous</option>
                  {typeList.map((type) => (
                    <option key={type.name} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
            </div>
            <div className="PokeList">
                {currentPokemonList.map((pokemon) => (
                    <li key={pokemon.name}>
                        <img src={pokemon.image} alt={pokemon.name} />
                        {pokemon.name}
                    </li>
                ))}
            </div>
            <div className="Pagination">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={page === currentPage}
                    >
                    {page}
                    </button>
                )
                )}
            </div>
        </>
    );
}