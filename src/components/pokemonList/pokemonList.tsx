import axios from 'axios';
import { apiUrl } from '../../App';
import { useEffect, useState } from 'react'
import { NavBar } from '../navBar/navBar';
import  { PopUpInfo} from '../popUpInfo/popUpInfo';
import styled, { keyframes } from 'styled-components';

const slideUp = keyframes `
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
`;

const slideDown = keyframes `
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(100%);
    }
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
    width: 70vw;
    height: 60vh;
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
    align-items: center;
    font-weight: bold;
    font-size: 120%;
    
`;

const Index = styled.p`
    font-weight: lighter;
    font-size: 100%;
`;

const Types = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    height: 100%;
    align-items: center;
    font-weight: bolder;
    font-size: 70%;
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
    
    @media (min-width:768px) {
        justify-content: center;
    }
`;


const PokemonListContent = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 80vw;
    height: 70vh;
    flex-direction: row;
    justify-content: center;
    overflow-y: scroll;

    @media (min-width:768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 80vh;
    }
`;

const Footer = styled.div `
    display: flex;
    width: 100vw;
    height: 5vh;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
`;

const PaginationContent = styled.div`
    display: flex;
    height: 5vh;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    @media (min-width:768px) {
        justify-content: center;
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
`;

const PopUpContainer = styled.div<{open: boolean}> `
    width: 100vw;
    height: 100vh;
    display: ${({ open }) => (open ? `flex` : `none`)};
    align-items: center; 
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    transition: top 0.3s eas-in-out;
    animation: ${({ open }) => (open ? slideUp : slideDown)} 0.3s ease-in-out;

`;


interface Pokemon {
    name: string;
    url: string;
    image: string;
    typeNames: string[];
    gameIndex: number;
    pokemonData: any;
  }

export interface PokemonType {
    name: string;
}


export function PokemonList() {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [pokemonPerPage, setPokemonPerPage] = useState(10);
    const [filterType, setFilterType] = useState('');
    const [typeList, setTypeList] = useState<PokemonType[]>([]);
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
                
                    return { name } as PokemonType;
                })

                const typeData = await Promise.all(typeDataPromises);
                setTypeList(typeData);
            }

            const response = await axios.get(apiUrl + `pokemon?limit=1010`);
            const results: Pokemon[] = response.data.results;

            const pokemonDataPromises = results.map(async (pokemon) => {
                const pokemonResponse = await axios.get(pokemon.url);
                const { name, sprites, types, id } = pokemonResponse.data;
                const pokemonData = pokemonResponse.data;
                const image = sprites.front_default;
                const typeNames = types.map((array: any) => array.type.name);
                const gameIndex = id;
    
                return { name, image, typeNames, gameIndex, pokemonData} as Pokemon;
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

    const renderPaginationButtons = () => {
        const buttons = [];

        if (currentPage > 1) {
            buttons.push(
                <PaginationButton key="first" isactive={currentPage === 1 ? 'true' : 'false'} onClick={() => handlePageChange(1)}>
                    1
                </PaginationButton>
            );
            if (currentPage > 3) {
                buttons.push(
                    <span key="prevWaiter">
                        ...
                    </span>
                );
            };
            if (currentPage > 2) {
                buttons.push(
                    <PaginationButton key="prev" isactive={'false'} onClick={() => handlePageChange(currentPage - 1)}>
                        {`<`}
                    </PaginationButton>
                );
            };
        };

        buttons.push(
            <PaginationButton key="currentPage" isactive={'true'} onClick={() => {}}>
                {currentPage}
            </PaginationButton>
        )
        
        if (currentPage < totalPages) {
            buttons.push(
                <PaginationButton key="next" isactive={'false'} onClick={() => handlePageChange(currentPage + 1)}>
                    {`>`}
                </PaginationButton>
            );
            if (currentPage < totalPages - 2) {
                buttons.push(
                    <span key="nextWaiter">
                        ...
                    </span>
                );
            };
            if (currentPage < totalPages - 1) {
                buttons.push(
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
    
        
    return (
        <Pokedex>
            <NavBar 
                onSearch={handleSearch}
                onFilterTypeChange={handleFilterTypeChange}
                pokemonPerPage={pokemonPerPage}
                filterType={filterType}
                typeList={typeList} />
            <PokemonListContent className="PokemonListContent">
                {currentPokemonList.map((pokemon) => (
                    <Card key={pokemon.name} type={pokemon.typeNames} onClick={() => handleOpenPopUpInfo(pokemon)}>
                        <CardTop>
                            <Text>
                                <p>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }</p>
                                <Index>#{pokemon.gameIndex.toString().padStart(4, "0")}</Index>
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
                ))}
            </PokemonListContent>
            <Footer>
                <PaginationContent className="Pagination">
                    <p>Page :</p>
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
                <PopUpInfo selectedPokemon={selectedPokemon} onClosePopUpInfo={handleClosePopUpInfo} />
            </PopUpContainer>
        </Pokedex>
    );
}