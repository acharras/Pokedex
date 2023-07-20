import styled from 'styled-components';
import { Pokemon } from './pokemonList';

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
    perspective: 1000px;
    margin: 10px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
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
    font-weight: 600;
    font-size: 50%;
    letter-spacing : 1px;

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
    align-items: center;
    box-shadow: rgba(255, 255, 255, 0.35) 0px -50px 36px -28px inset;
    background-color: ${({ type }) => (type ? `var(--${type})` : 'none')};
`;

const SpanType = styled.div `
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.1);
`;


const PokemonListContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100vw;
    height: 77vh;
    flex-direction: row;
    overflow-y: auto;
    justify-content: space-evenly;

    @media (min-width:768px) {
        height: 100vh;
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


const FavoriteButton = styled.button`
    background-color: transparent;
    border: none;
    font-size: 24px;
    color: rgb(46, 48, 87);
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
    color: rgb(46, 48, 87);
    cursor: pointer;
    z-index: 2;
    margin-right: 5%;
    margin-top: 3%;

    @media (min-width:768px) {
        font-size: 32px;
    }
`;


const NoPokemonListContainer = styled.div`
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


interface PokemonListContentProps {
    currentPokemonList: Pokemon[];
    favoritePokemons: any;
    handleFavorites: any;
    handleOpenPopUpInfo: any;
}


export function PokemonListContent({ currentPokemonList, favoritePokemons, handleFavorites, handleOpenPopUpInfo }: PokemonListContentProps) {
    
    return (
            <PokemonListContainer className="PokemonListContainer">
                {currentPokemonList.length !== 0 ? (
                    currentPokemonList.map((pokemon) => (
                    <Card key={pokemon.name} type={pokemon.typeNames} onClick={(e) => handleOpenPopUpInfo(pokemon, e)}>
                        <CardTop>
                            <Text>
                                <TextInfo>
                                    <div>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }</div>
                                    <Index>#{pokemon.gameIndex.toString().padStart(4, "0")}</Index>
                                </TextInfo>
                                {favoritePokemons.favorites && favoritePokemons.favorites.some((fav:any) => fav.name === pokemon.name) ?
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
                    <NoPokemonListContainer>Pokemon not found.</NoPokemonListContainer>
                )}
            </PokemonListContainer>
    );
}
