import styled from 'styled-components';
import { PopUpInfoPokemon } from './popUpInfo';

const PopUpCard = styled.div<{type : string[] }> `
    --normal: rgb(168, 167, 122, 0.8);
    --fire: rgb(238, 129, 48, 0.8);
    --water: rgb(99, 144, 240, 0.8);
    --electric: rgb(247, 208, 44, 0.8);
    --grass: rgb(122, 199, 76, 0.8);
    --ice: rgb(150, 217, 214, 0.8);
    --fighting: rgb(194, 46, 40, 0.8);
    --poison: rgb(163, 62, 161, 0.8);
    --ground: rgb(226, 191, 101, 0.8);
    --flying: rgb(169, 143, 243, 0.8);
    --psychic: rgb(249, 85, 135, 0.8);
    --bug: rgb(166, 185, 26, 0.8);
    --rock: rgb(182, 161, 54, 0.8);
    --ghost: rgb(115, 87, 151, 0.8);
    --dragon: rgb(111, 53, 252, 0.8);
    --dark: rgb(112, 87, 70, 0.8);
    --steel: rgb(183, 183, 206, 0.8);
    --fairy: rgb(214, 133, 173, 0.8);

    display: flex;
    flex-direction: column;
    width: 100%;
    height: 30%;
    background: linear-gradient(
        to right bottom,
        ${({ type }) => (type[0] ? `var(--${type[0]})` : 'none')} 70%,
        ${({ type }) => (type[1] ? `var(--${type[1]})` : `var(--${type[0]})`)} 30%
    );
    background-color: rgba(255, 255, 255, 0.9);
    

    @media (min-width:768px) {
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
    }
`;

const CardImage = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 70%;
`;

const CardText = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    height: 30%;
    align-items: center;
    font-weight: bold;
    font-size: 80%;

    @media (min-width:250px) {
        font-size: 120%;
    }
    
`;

const CardTextInfo = styled.div`
    display: flex;
    flex-direction: row;
    align-items: baseline;
    padding-left: 32px;

    @media (min-width:768px) {
        padding-left: 0px;
    }
`;

const CardIndex = styled.p`
    font-weight: lighter;
    font-size: 80%;

    @media (min-width:250px) {
        font-size: 100%;
    }
`;

const FavoriteButton = styled.button`
    background-color: transparent;
    border: none;
    font-size: 32px;
    color: rgb(46, 48, 87);
    cursor: pointer;
    z-index: 2;
    
`;

const NotFavoriteButton = styled.button`
    background-color: transparent;
    border: none;
    font-size: 32px;
    color: rgb(46, 48, 87);
    cursor: pointer;
    z-index: 2;

`;

interface CardProps {
    selectedPokemon: PopUpInfoPokemon;
    favoritePokemons: any; 
    handleFavorites: any;
}

export function Card({ selectedPokemon, favoritePokemons, handleFavorites }:CardProps) {
    
    return (
        <PopUpCard type={selectedPokemon.typeNames}>
            <CardText>
                <CardTextInfo>
                    <h2>{selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1) }</h2>
                    <CardIndex>#{selectedPokemon.gameIndex.toString().padStart(4, "0")}</CardIndex>
                </CardTextInfo>
                {favoritePokemons.favorites && favoritePokemons.favorites.some((fav:any) => fav.name === selectedPokemon.name) ?
                    <FavoriteButton onClick={() => handleFavorites(selectedPokemon)}>
                        ★
                    </FavoriteButton>
                :
                    <NotFavoriteButton onClick={() => handleFavorites(selectedPokemon)}>
                        ☆
                    </NotFavoriteButton>
                }
            </CardText>
            <CardImage>
                <img src={selectedPokemon.image} alt={selectedPokemon.name} />
            </CardImage>
        </PopUpCard>
    );
};