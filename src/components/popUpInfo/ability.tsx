import styled from 'styled-components';
import { PopUpInfoPokemon } from './popUpInfo';

const AbilityContainer = styled.div `
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-left: 5%;
    margin-top: 5%;
`;

const AbilityContent = styled.div `
    display : flex;
    flex-direction: row;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    margin-bottom: 20px;
`;

const AbilityInfo = styled.li `
    display : flex;
    flex-direction: column;
    margin: 5%;
`;


interface AbilityProps {
    selectedPokemon: PopUpInfoPokemon;
    abilityDetails: Record<string, string>;
}

export function Ability({ selectedPokemon, abilityDetails }:AbilityProps) {
    
    return (
        <AbilityContainer>
            {selectedPokemon.pokemonData.abilities.map((array : { ability : { name : string; url : string }}, index:number) => (
                <AbilityContent key={`${array.ability.name}-${index}`}>
                    <AbilityInfo>
                        <strong>{array.ability.name.charAt(0).toUpperCase() + array.ability.name.replace(/-/g, ' ').slice(1)}</strong>
                        {abilityDetails[array.ability.name] && <p>{abilityDetails[array.ability.name]}</p>}
                    </AbilityInfo>
                </AbilityContent>
            ))}
        </AbilityContainer>
    );
};
