import styled from 'styled-components';
import { PopUpInfoPokemon } from './popUpInfo';

const ButtonContainer = styled.div`
    display: flex;
    height: 10%;
    width: 95%;
    justify-content: space-between;
    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar {
        height: 6px;
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

const Button = styled.button<{active: string}>`
    display: inline-block;
    height: 44px; 
    margin: 5px;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background-color: ${({ active }) => (active === 'true' ? '#ffd900' : '#fff')};
    color: ${({ active }) => (active === 'true' ? 'rgb(46, 48, 87)' : 'gray')};
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
    border-bottom: 2px solid rgba(128, 128, 128, 0.3);
    border-left: 2px solid rgba(128, 128, 128, 0.3);
    border-top: 2px solid gray;
    border-right: 2px solid gray;
    font-weight: bold;
    font-size: 70%;

    @media (min-width:250px) {
        font-size: 90%;
    }

    &:hover {
        transform: scale(1.05);
    }
`;


interface ButtonCardProps {
    selectedPokemon: PopUpInfoPokemon;
    activeButton: string;
    haveEvolution: boolean;
    formsSwitchable: boolean | undefined;
    location: string[];
    handleButtonClick: any;
}

export function ButtonCard({ selectedPokemon, activeButton, haveEvolution, formsSwitchable, location, handleButtonClick }:ButtonCardProps) {
    
    return (
        <ButtonContainer>
            <Button active={activeButton === 'about' ? 'true' : 'false'} onClick={() => handleButtonClick('about')}>About</Button>
            {haveEvolution === true ? <Button active={activeButton === 'evolution' ? 'true' : 'false'} onClick={() => handleButtonClick('evolution')}>Evolution</Button> : null}
            <Button active={activeButton === 'stats' ? 'true' : 'false'} onClick={() => handleButtonClick('stats')}>Stats</Button>
            <Button active={activeButton === 'moves' ? 'true' : 'false'} onClick={() => handleButtonClick('moves')}>Moves</Button>
            <Button active={activeButton === 'abilities' ? 'true' : 'false'} onClick={() => handleButtonClick('abilities')}>Abilities</Button>
            {formsSwitchable ? 
            <Button active={activeButton === 'forms' ? 'true' : 'false'} onClick={() => handleButtonClick('forms')}>Forms</Button>
            :null}
            {location.length > 0 ? 
            <Button active={activeButton === 'location' ? 'true' : 'false'} onClick={() => handleButtonClick('location')}>Location</Button>
            :null}
            {selectedPokemon.pokemonData.held_items.length > 0 ? 
            <Button active={activeButton === 'heldItems' ? 'true' : 'false'} onClick={() => handleButtonClick('heldItems')}>Helditems</Button>
            :null}
        </ButtonContainer>
    );
};