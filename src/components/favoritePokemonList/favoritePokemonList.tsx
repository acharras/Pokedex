import { useEffect, useState } from 'react'
import { NavBar } from '../navBar/navBar';
import  { PopUpInfo } from '../popUpInfo/popUpInfo';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { addFavoritePokemon, removeFavoritePokemon } from '../../reducers/actions/index';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers/reducer/types';
import { connect } from 'react-redux';
import { Pokemon } from '../pokemonList/pokemonList'
import { PokemonType } from '../../App'
import { FavoritePokemonListContent } from './favoritePokemonListContent'


const Pokedex = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    touch-action: pan-y;
    
    @media (min-width:768px) {
        justify-content: center;
    }
`;

const Footer = styled.div `
    display: flex;
    width: 100vw;
    height: 5vh;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    @media (min-width:768px) {
        justify-content: flex-end;
    }
`;

const PaginationContent = styled.div`
    display: flex;
    height: 5vh;
    width: 50vw;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    font-size: 70%;

    @media (min-width:768px) {
        justify-content: center;
        font-size: 100%;
    }
`;

const PaginationButton = styled.button<{ $isactive: string }>`
    padding: 5px 10px;
    border: none;
    background-color: ${({ $isactive }) => ($isactive === 'true' ? "#ffcb05" : "transparent")};
    color: rgb(46, 48, 87);
    font-weight: ${({ $isactive }) => ($isactive === 'true'  ? "bold" : "normal")};
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const PaginationSpan = styled.span `
    color: rgb(46, 48, 87);
    font-size: smaller;
`;

const PokemonPerPage = styled.div `
    display:flex;
    flex-direction: row;
    width: 50vw;
    font-size: 70%;
    align-items: center;

    @media (min-width:768px) {
        justify-content: center;
        font-size: 100%;
    }
`;

const PopUpContainer = styled.div<{open: boolean}> `
    display: ${({ open }) => (open ? `flex` : `none`)};
    width: 100vw;
    height: 100vh;
    align-items: center; 
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
`;

const NoPokemonListContent = styled.div`
    display: flex;
    width: 80vw;
    height: 70vh;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow-y: auto;

    @media (min-width:768px) {
        height: 100vh;
    }

    &::-webkit-scrollbar {
        height: 10px;
        width: 10px;
      }
      
    &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 3px rgba(0,0,0,0.3); 
        border-radius: 10px;
    }
      
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 3px rgba(0,0,0,0.5); 
    }
`;

interface FavoritePokemonListProps {
    typeList: PokemonType[];
}
export function FavoritePokemonList(typeList: FavoritePokemonListProps) {
    const favoritePokemons = useSelector((state: RootState) => state.favorites.favorites);
    const favoritePokemonList = useSelector((state: RootState) => state.favorites);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [pokemonPerPage, setPokemonPerPage] = useState(10);
    const [filterType, setFilterType] = useState('');
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [isPopUpInfoOpen, setIsPopUpInfoOpen] = useState(false);
    const dispatch = useDispatch();
    

    

    const fetchPokemonList = async () => {
        try {
            if (searchTerm) {
                const filteredTotalCount = favoritePokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())).filter((pokemon) => filterType === '' || pokemon.typeNames.includes(filterType)).length;
                const totalPages = Math.ceil(filteredTotalCount / pokemonPerPage);
                setTotalPages(totalPages);
            } else {
                const totalCount = favoritePokemons.filter((pokemon) => filterType === '' || pokemon.typeNames.includes(filterType)).length;
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
        setCurrentPage(1);
    };

    
    const handleOpenPopUpInfo = (pokemon: Pokemon, event: React.MouseEvent) => {
        setSelectedPokemon(pokemon);
        setIsPopUpInfoOpen(true);
        event.stopPropagation();
    };
      
    const handleClosePopUpInfo = () => {
        setIsPopUpInfoOpen(false);
    };

    const renderPaginationButtons = () => {
        const buttons = [];

        if (currentPage > 1) {
            buttons.push(
                // eslint-disable-next-line react/prop-types
                <PaginationButton key="first" $isactive={currentPage === 1 ? 'true' : 'false'} onClick={() => handlePageChange(1)}>
                    1
                </PaginationButton>
            );
            if (currentPage > 2) {
                if (currentPage > 3) {
                    if (currentPage > 4) {
                        buttons.push(
                            <PaginationSpan key="prevWaiter">
                                {`<<`}
                            </PaginationSpan>
                        );
                    }
                    buttons.push(
                        // eslint-disable-next-line react/prop-types
                        <PaginationButton key="prevPrev" $isactive={'false'} onClick={() => handlePageChange(currentPage - 2)}>
                            {`${currentPage - 2}`}
                        </PaginationButton>
                    );
                }
                buttons.push(
                    // eslint-disable-next-line react/prop-types
                    <PaginationButton key="prev" $isactive={'false'} onClick={() => handlePageChange(currentPage - 1)}>
                        {`${currentPage - 1}`}
                    </PaginationButton>
                );
            };
        };

        buttons.push(
            // eslint-disable-next-line react/prop-types
            <PaginationButton key="currentPage" $isactive={'true'} onClick={() => {}}>
                {currentPage}
            </PaginationButton>
        )
        
        if (currentPage < totalPages) {
            if (currentPage < totalPages - 1) {
                buttons.push(
                    // eslint-disable-next-line react/prop-types
                    <PaginationButton key="next" $isactive={'false'} onClick={() => handlePageChange(currentPage + 1)}>
                        {`${currentPage + 1}`}
                    </PaginationButton>
                );
                if (currentPage < totalPages - 2) {
                    buttons.push(
                        // eslint-disable-next-line react/prop-types
                        <PaginationButton key="nextNext" $isactive={'false'} onClick={() => handlePageChange(currentPage + 2)}>
                            {`${currentPage + 2}`}
                        </PaginationButton>
                    );
                    if (currentPage < totalPages - 3) {
                        buttons.push(
                            <PaginationSpan key="nextWaiter">
                                {`>>`}
                            </PaginationSpan>
                        );
                    }
                }
                
            }
            if (currentPage < totalPages ) {
                buttons.push(
                    // eslint-disable-next-line react/prop-types
                    <PaginationButton key="last" $isactive={currentPage === totalPages ? 'true' : 'false'} onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                    </PaginationButton>
                );
            };
        };

        return buttons;
    }

    const filteredFavoritePokemonList = searchTerm
    ? favoritePokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())).filter((pokemon) =>
        filterType === '' || pokemon.typeNames.includes(filterType))
    : favoritePokemons.filter((pokemon) =>
        filterType === '' || pokemon.typeNames.includes(filterType));

    const startIndex = (currentPage - 1) * pokemonPerPage;
    const endIndex = Math.min(startIndex + pokemonPerPage, filteredFavoritePokemonList.length);
    const currentFavoritePokemonList = filteredFavoritePokemonList.slice(startIndex, endIndex);

    
    const handleFavorites = (pokemon: Pokemon, event: React.MouseEvent) => {
        if (favoritePokemons && favoritePokemonList.favorites.length > 0) {
            const isPokemonFavorite = favoritePokemonList.favorites.some((fav) => fav.name === pokemon.name);
            
            if (isPokemonFavorite) {
              dispatch(removeFavoritePokemon(pokemon));
            } else {
              dispatch(addFavoritePokemon(pokemon));
            }
        } else {
            dispatch(addFavoritePokemon(pokemon));
        }
        event.stopPropagation();
    };  
      

    useEffect(() => {
        fetchPokemonList();
// eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    useEffect(() => {
        setCurrentPage(1); 
      }, [searchTerm]);

    useEffect(() => {
        if (currentPage !== 1) {
          setCurrentPage(1);
        }
        
        const filteredTotalCount = favoritePokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())).filter((pokemon) => 
        filterType === '' || pokemon.typeNames.includes(filterType)).length;
        const totalPages = Math.ceil(filteredTotalCount / pokemonPerPage);
        setTotalPages(totalPages);
// eslint-disable-next-line react-hooks/exhaustive-deps
      }, [searchTerm, filterType, pokemonPerPage]);
      
    return (
        <Pokedex>
            <NavBar 
                onSearch={handleSearch}
                onFilterTypeChange={handleFilterTypeChange}
                pokemonPerPage={pokemonPerPage}
                filterType={filterType}
                typeList={typeList.typeList} />
            {favoritePokemons.length === 0 ? (
                <NoPokemonListContent>No favourite Pokémon yet.</NoPokemonListContent>
            ) : (
                <FavoritePokemonListContent currentFavoritePokemonList={currentFavoritePokemonList} favoritePokemons={favoritePokemons} handleFavorites={handleFavorites} handleOpenPopUpInfo={handleOpenPopUpInfo}/>
            )}
            <Footer>
                <PaginationContent className="Pagination">
                    {renderPaginationButtons()}
                </PaginationContent>
                <PokemonPerPage>
                    <label htmlFor="pokemonPerPage">Amount / page: </label>
                    <select
                      id="pokemonPerPage"
                      value={pokemonPerPage}
                      onChange={handlePokemonPerPageChange}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={40}>40</option>
                    </select>
                </PokemonPerPage>
            </Footer>
            <PopUpContainer className="PopUpContainer" open={isPopUpInfoOpen}>
                <PopUpInfo selectedPokemon={selectedPokemon} isPopUpInfoOpen={isPopUpInfoOpen} onClosePopUpInfo={handleClosePopUpInfo} />
            </PopUpContainer>
        </Pokedex>
    );
}

const mapStateToProps = (state: RootState) => ({
    favoritePokemons: state.favorites.favorites,
  });
  
export default connect(mapStateToProps)(FavoritePokemonList);