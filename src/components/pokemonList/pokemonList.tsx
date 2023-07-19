import axios from 'axios';
import { apiUrl } from '../../App';
import { useEffect, useState } from 'react'
import { NavBar } from '../navBar/navBar';
import  { PopUpInfo } from '../popUpInfo/popUpInfo';
import styled, { keyframes } from 'styled-components';
import { useDispatch } from 'react-redux';
import { addFavoritePokemon, removeFavoritePokemon } from '../../reducers/actions/index';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers/reducer/types';
import { connect } from 'react-redux';
import { PokemonType } from '../../App'

const blink = keyframes `
    from { background: #eee; }
    to { background: #e74c3c; }
`;

const shake = keyframes `
    0 { transform: translate(0, 0) rotate(0); }
    20% { transform: translate(-10px, 0) rotate(-20deg); }
    30% { transform: translate(10px, 0) rotate(20deg); }
    50% { transform: translate(-10px, 0) rotate(-10deg); }
    60% { transform: translate(10px, 0) rotate(10deg); }
    100% { transform: translate(0, 0) rotate(0); }
`;

const fall = keyframes `
    0% { top: -200px }
    60% { top: 0 }
    80% { top: -20px }
    100% { top: 0 }
`;

const Card = styled.div<{ type : string[] }>`
    --normal: rgb(168, 167, 122);
    --fire: rgb(238, 129, 48);
    --water: rgb(99, 144, 240);
    --electric: rgb(247, 208, 44);
    --grass: rgb(122, 199, 76);
    --ice: rgb(150, 217, 214);
    --fighting: rgb(194, 46, 40);
    --poison: rgb(163, 62, 161);
    --ground: rgb(226, 191, 101);
    --flying: rgb(169, 143, 243);
    --psychic: rgb(249, 85, 135);
    --bug: rgb(166, 185, 26);
    --rock: rgb(182, 161, 54);
    --ghost: rgb(115, 87, 151);
    --dragon: rgb(111, 53, 252);
    --dark: rgb(112, 87, 70);
    --steel: rgb(183, 183, 206);
    --fairy: rgb(214, 133, 173);

    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 40vw;
    height: 30vh;
    border-radius: 12px;
    border: solid 4px;
    border-color: #DCBF00;
    perspective: 1000px;
    margin: 10px;
    background: linear-gradient(
        to right bottom,
        ${({ type }) => (type[0] ? `var(--${type[0]})` : 'none')} 70%,
        ${({ type }) => (type[1] ? `var(--${type[1]})` : `var(--${type[0]})`)} 30%
    );
    transition: transform .2s;
    
    @media (min-width:768px) {
        width: 20vw;
        height: 30vh;
    }

    &:hover {
        transform: scale(1.05);
    }
`;

const CardTop = styled.div `
    display: flex;
    flex-direction: column;
    height: 80%;
    background-color: rgba(255, 255, 255, 0.3);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
`;

const CardBottom = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 20%;
`;

const Image = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 70%;
`;

const Text = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    height: 30%;
    
`;

const TextInfo = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    font-weight: bold;
    font-size: 80%;
    margin-left: 5%;
    margin-top: 5%;

    @media (min-width:768px) {
        font-size: 120%;
    }
`;

const Index = styled.div`
    font-weight: lighter;
    font-size: 60%;

    @media (min-width:768px) {
        font-size: 80%;
    }
`;

const Types = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    height: 100%;
    align-items: center;
    font-weight: bolder;
    font-size: 50%;

    @media (min-width:768px) {
        font-size: 70%;
    }
`;

const Type = styled.div<{ type : string }>`
    --normal: rgb(168, 167, 122);
    --fire: rgb(238, 129, 48);
    --water: rgb(99, 144, 240);
    --electric: rgb(247, 208, 44);
    --grass: rgb(122, 199, 76);
    --ice: rgb(150, 217, 214);
    --fighting: rgb(194, 46, 40);
    --poison: rgb(163, 62, 161);
    --ground: rgb(226, 191, 101);
    --flying: rgb(169, 143, 243);
    --psychic: rgb(249, 85, 135);
    --bug: rgb(166, 185, 26);
    --rock: rgb(182, 161, 54);
    --ghost: rgb(115, 87, 151);
    --dragon: rgb(111, 53, 252);
    --dark: rgb(112, 87, 70);
    --steel: rgb(183, 183, 206);
    --fairy: rgb(214, 133, 173);

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 30%;
    height: 50%;
    border-radius: 12px;
    border: solid 4px;
    border-color: #DCBF00;
    align-items: center;
    background-color: ${({ type }) => (type ? `var(--${type})` : 'none')};
`;

const SpanType = styled.div `
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
`;

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


const PokemonListContent = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100vw;
    height: 70vh;
    flex-direction: row;
    overflow-y: auto;
    justify-content: space-evenly;

    @media (min-width:768px) {
        height: 80vh;
        width: 100vw;
        gap: 5%;
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
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    font-size: 70%;

    @media (min-width:768px) {
        justify-content: center;
        font-size: 100%;
    }
`;

const PaginationButton = styled.button<{ isactive: string }>`
    padding: 5px 10px;
    border: none;
    background-color: ${({ isactive }) => (isactive === 'true' ? "#DCBF00" : "transparent")};
    color: ${({ isactive }) => (isactive === 'true'  ? "#FFFFFF" : "#000000")};
    font-weight: ${({ isactive }) => (isactive === 'true'  ? "bold" : "normal")};
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const PokemonPerPage = styled.div `
    display:flex;
    flex-direction: row;
    width: 40%;
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

const FavoriteButton = styled.button`
    background-color: transparent;
    border: none;
    font-size: 24px;
    color: #DCBF00;
    cursor: pointer;
    z-index: 2;
    margin-right: 5%;
    margin-top: 3%;
    
    @media (min-width:768px) {
        font-size: 32px;
    }
`;

const NotFavoriteButton = styled.button`
    background-color: transparent;
    border: none;
    font-size: 24px;
    color: grey;
    cursor: pointer;
    z-index: 2;
    margin-right: 5%;
    margin-top: 3%;

    @media (min-width:768px) {
        font-size: 32px;
    }
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
        height: 80vh;
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

const Loading = styled.div`
    *, *:before, *:after {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
`;

const Pokeball = styled.div `
    position: relative;
    width: 200px;
    height: 200px;
    background: #fff;
    border: 10px solid #000;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: inset -10px 10px 0 10px #ccc;
    animation:  ${fall} .25s ease-in-out,
                ${shake} 1.25s cubic-bezier(.36,.07,.19,.97) 3;

`;

const PokeballBeforeAfter = styled.div`
    position: absolute;
`;

const PokeballBefore = styled(PokeballBeforeAfter)`
    background: red;
    width: 100%;
    height: 50%;
`;

const PokeballAfter = styled(PokeballBeforeAfter)`
    top: calc(50% - 10px);
    width: 100%;
    height: 20px;
    background: #000;
`;

const PokeballButton = styled.div `
    position: absolute;
    top: calc(50% - 30px);
    left: calc(50% - 30px);
    width: 60px;
    height: 60px;
    background: #7f8c8d;
    border: 10px solid #fff;
    border-radius: 50%;
    z-index: 10;
    box-shadow: 0 0 0 10px black;
    animation: ${blink} .5s alternate 7;
`;

export interface Pokemon {
    name: string;
    url: string;
    image: string;
    typeNames: string[];
    gameIndex: number;
    pokemonData: any;
    evolutionRank: number;
  }

interface PokemonListProps {
    typeList: PokemonType[];
}


export function PokemonList(typeList: PokemonListProps) {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [pokemonPerPage, setPokemonPerPage] = useState(10);
    const [filterType, setFilterType] = useState('');
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [isPopUpInfoOpen, setIsPopUpInfoOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const favoritePokemons = useSelector((state: RootState) => state.favorites);
    

    const fetchPokemonList = async () => {
        try {

            const response = await axios.get(apiUrl + `pokemon?limit=1010`);
            const results: Pokemon[] = response.data.results;

            const pokemonDataPromises = results.map(async (pokemon) => {
                const pokemonResponse = await axios.get(pokemon.url);
                const { name, sprites, types, id } = pokemonResponse.data;
                const pokemonData = pokemonResponse.data;
                const image = sprites.front_default;
                const typeNames = types.map((array: any) => array.type.name);
                const gameIndex = id;
    
                return { name, image, typeNames, gameIndex, pokemonData } as Pokemon;
            });

            const pokemonData = await Promise.all(pokemonDataPromises);
            setPokemonList(pokemonData);
            setIsLoaded(true);

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
                <PaginationButton key="first" isactive={currentPage === 1 ? 'true' : 'false'} onClick={() => handlePageChange(1)}>
                    1
                </PaginationButton>
            );
            if (currentPage > 2) {
                buttons.push(
                    <span key="prevWaiter">
                        ...
                    </span>
                );
                buttons.push(
                    // eslint-disable-next-line react/prop-types
                    <PaginationButton key="prev" isactive={'false'} onClick={() => handlePageChange(currentPage - 1)}>
                        {`<`}
                    </PaginationButton>
                );
            };
        };

        buttons.push(
            // eslint-disable-next-line react/prop-types
            <PaginationButton key="currentPage" isactive={'true'} onClick={() => {}}>
                {currentPage}
            </PaginationButton>
        )
        
        if (currentPage < totalPages) {
            if (currentPage < totalPages - 1) {
                buttons.push(
                    // eslint-disable-next-line react/prop-types
                    <PaginationButton key="next" isactive={'false'} onClick={() => handlePageChange(currentPage + 1)}>
                        {`>`}
                    </PaginationButton>
                );
                buttons.push(
                    <span key="nextWaiter">
                        ...
                    </span>
                );
            }
            if (currentPage < totalPages ) {
                buttons.push(
                    // eslint-disable-next-line react/prop-types
                    <PaginationButton key="last" isactive={currentPage === totalPages ? 'true' : 'false'} onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                    </PaginationButton>
                );
            };
        };

        return buttons;
    }

    const filteredPokemonList = searchTerm
    ? pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())).filter((pokemon) =>
        filterType === '' || pokemon.typeNames.includes(filterType))
    : pokemonList.filter((pokemon) =>
        filterType === '' || pokemon.typeNames.includes(filterType));

    const startIndex = (currentPage - 1) * pokemonPerPage;
    const endIndex = startIndex + pokemonPerPage;
    const currentPokemonList = filteredPokemonList.slice(startIndex, endIndex);

    
    const handleFavorites = (pokemon: Pokemon, event: React.MouseEvent) => {
        if (favoritePokemons && favoritePokemons.favorites.length > 0) {
            const isPokemonFavorite = favoritePokemons.favorites.some((fav) => fav.name === pokemon.name);
            
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
        
        const filteredTotalCount = pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())).filter((pokemon) => 
        filterType === '' || pokemon.typeNames.includes(filterType)).length;
        const totalPages = Math.ceil(filteredTotalCount / pokemonPerPage);
        setTotalPages(totalPages);
// eslint-disable-next-line react-hooks/exhaustive-deps
      }, [searchTerm, filterType, pokemonPerPage, pokemonList]);
      
      
      
    return (
        <Pokedex>
            {isLoaded === true ? (
                <>
            <NavBar 
                onSearch={handleSearch}
                onFilterTypeChange={handleFilterTypeChange}
                pokemonPerPage={pokemonPerPage}
                filterType={filterType}
                typeList={typeList.typeList} />
            <PokemonListContent className="PokemonListContent">
                {currentPokemonList.length !== 0 ? (
                    currentPokemonList.map((pokemon) => (
                    <Card key={pokemon.name} type={pokemon.typeNames} onClick={(e) => handleOpenPopUpInfo(pokemon, e)}>
                        <CardTop>
                            <Text>
                                <TextInfo>
                                    <div>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }</div>
                                    <Index>#{pokemon.gameIndex.toString().padStart(4, "0")}</Index>
                                </TextInfo>
                                {favoritePokemons.favorites && favoritePokemons.favorites.some((fav) => fav.name === pokemon.name) ?
                                    <FavoriteButton onClick={(e) => handleFavorites(pokemon, e)}>
                                        ★
                                    </FavoriteButton>
                                :
                                    <NotFavoriteButton onClick={(e) => handleFavorites(pokemon, e)}>
                                        ☆
                                    </NotFavoriteButton>
                                }
                            </Text>
                            <Image>
                                <img src={pokemon.image} alt={pokemon.name} />
                            </Image>
                        </CardTop>
                        <CardBottom>
                            <Types>
                                {pokemon.typeNames.map((name) => (
                                    <Type type={name} key={name}>
                                        <SpanType>{name.toUpperCase()}</SpanType>
                                    </Type>
                                ))}
                            </Types>
                        </CardBottom>
                    </Card>
                    ))
                ) : (
                    <NoPokemonListContent>Pokemon not found.</NoPokemonListContent>
                )}
            </PokemonListContent>
            <Footer>
                <PaginationContent className="Pagination">
                    <p>Page:</p>
                    {renderPaginationButtons()}
                </PaginationContent>
                <PokemonPerPage>
                    <label htmlFor="pokemonPerPage">Number of pokemon per page: </label>
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
            </>
            ) : (
                <Loading><Pokeball><PokeballBefore /><PokeballAfter /><PokeballButton /></Pokeball></Loading>
            )}
        </Pokedex>
    );
}

const mapStateToProps = (state: RootState) => ({
    favoritePokemons: state.favorites.favorites,
  });
  
export default connect(mapStateToProps)(PokemonList);