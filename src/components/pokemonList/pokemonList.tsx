import "./pokemonList.css";
import axios from 'axios';
import { apiUrl } from '../../App';
import { useEffect, useState } from 'react'
import { SearchBar } from '../searchBar/searchBar';
import  { PopUpInfo, PopUpInfoPokemon } from '../popUpInfo/popUpInfo';

export function PokemonList() {

    interface Pokemon {
        name: string;
        url: string;
        image: string;
        typeNames: string[];
        gameIndex: number;
        pokemonData: any;
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
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [isPopUpInfoOpen, setIsPopUpInfoOpen] = useState(false);
    


    const fetchPokemonList = async () => {
        try {
            if (!typeList.length)
            {
                const typeResponse = await axios.get(apiUrl + 'type/');
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

            const pokemonDataPromises = results.map(async (pokemon, index) => {
                const pokemonResponse = await axios.get(pokemon.url);
                const { name, sprites, types } = pokemonResponse.data;
                const pokemonData = pokemonResponse.data;
                const image = sprites.front_default;
                const typeNames = types.map((array: any) => array.type.name);
                const gameIndex = index + 1;

                return { name, image, typeNames, gameIndex, pokemonData } as Pokemon;
            });

            const pokemonData = await Promise.all(pokemonDataPromises);
            setPokemonList(pokemonData);

            if (searchTerm) {
                const filteredTotalCount = pokemonData.filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())).filter((pokemon) => filterType === '' || pokemon.typeNames.includes(filterType)).length;
                const totalPages = Math.ceil(filteredTotalCount / pokemonPerPage);
                setTotalPages(totalPages);
            } else {
                const totalCount = pokemonData.filter((pokemon) => filterType === '' || pokemon.typeNames.includes(filterType)).length;
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

    const handleFilterTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFilterType = event.target.value;
        setFilterType(selectedFilterType);
    };

    
    const handleOpenPopUpInfo = (pokemon: Pokemon) => {
        setSelectedPokemon(pokemon);
        setIsPopUpInfoOpen(true);
    };
      
    const handleClosePopUpInfo = () => {
        setIsPopUpInfoOpen(false);
    }; 

    const filteredPokemonList = searchTerm
    ? pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())).filter((pokemon) =>
        filterType === '' || pokemon.typeNames.includes(filterType))
    : pokemonList.filter((pokemon) =>
        filterType === '' || pokemon.typeNames.includes(filterType));

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
        
        const filteredTotalCount = pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())).filter((pokemon) => 
        filterType === '' || pokemon.typeNames.includes(filterType)).length;
        const totalPages = Math.ceil(filteredTotalCount / pokemonPerPage);
        setTotalPages(totalPages);
      }, [searchTerm, filterType, pokemonPerPage, pokemonList]);
      

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
                  {typeList.filter((type) => type.name !== "unknown").map((type) => (
                    <option key={type.name} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
            </div>
            <div className="PokeList">
                {currentPokemonList.map((pokemon) => (
                    <li key={pokemon.name} onClick={() => handleOpenPopUpInfo(pokemon)}>
                        <img src={pokemon.image} alt={pokemon.name} />
                        {pokemon.name}#{pokemon.gameIndex}
                    </li>
                ))}
            </div>
            {isPopUpInfoOpen && (<PopUpInfo selectedPokemon={selectedPokemon} onClosePopUpInfo={handleClosePopUpInfo} />)}
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