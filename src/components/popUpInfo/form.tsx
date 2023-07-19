import styled from 'styled-components';
import { PopUpInfoPokemon } from './popUpInfo';

const FormContent = styled.div`
    display: flex;  
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 90%;
    margin-left: 5%;
    margin-top: 20px;
`;

const FormInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const FormImage = styled.img `
    width: 96px;    
    height: 96px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 100px;
`;

const FormText = styled.p `
    color: rgba(46, 48, 87, 0.6);
`;

interface FormProps {
    selectedPokemon: PopUpInfoPokemon;
    formsImage: Record<string, string>;
}

export function Form({ selectedPokemon, formsImage }:FormProps) {

    return (
        <FormContent>
            {selectedPokemon.pokemonData.forms.map((array : { name : string; url : string }) => (
                <FormInfo key={array.url}>
                    <FormImage src={formsImage[array.name]} alt={array.name} />
                    <FormText>{array.name.charAt(0).toUpperCase() + array.name.replace(/-/g, ' ').slice(1)}</FormText>
                </FormInfo>
            ))}
        </FormContent>
    );
};