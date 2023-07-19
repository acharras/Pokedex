import styled from 'styled-components';
import { PopUpInfoPokemon } from './popUpInfo';

const HeldItemContainer = styled.div `
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-left: 5%;
    margin-top: 5%;
`;

const HeldItemContent = styled.div `
    display : flex;
    flex-direction: row;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    margin-bottom: 20px;
`;

const HeldItemInfo = styled.li `
    display : flex;
    flex-direction: column;
    margin: 5%;
`;

interface HeldItemProps {
    selectedPokemon: PopUpInfoPokemon;
}

export function HeldItem({ selectedPokemon }:HeldItemProps) {

    return (
        <HeldItemContainer>
            {selectedPokemon.pokemonData.held_items.map((array: { item: { name: string } }) => (
                <HeldItemContent key={array.item.name}>
                    <HeldItemInfo>
                        {array.item.name.charAt(0).toUpperCase() + array.item.name.replace(/-/g, ' ').slice(1)}
                    </HeldItemInfo>
                </HeldItemContent>
            ))}
        </HeldItemContainer>
    );
};
