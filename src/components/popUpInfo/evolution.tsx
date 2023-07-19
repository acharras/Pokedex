import styled from 'styled-components';
import { PopUpInfoPokemon } from './popUpInfo';


const EvolutionContainer = styled.div `
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-left: 5%;
`;

const EvolutionContent = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center;
    width:100%;
`;

const EvolutionInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const EvolutionFirst = styled.div`
    display: flex;  
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
`;

const EvolutionSecond = styled.div`
    display: flex;  
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
`;

const EvolutionThird = styled.div`
    display: flex;  
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
`;

const EvolutionImage = styled.img `
    width: 100%;    
    height: auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 100px;
`;

const EvolutionText = styled.p `
    color: rgba(46, 48, 87, 0.6);
`;


interface EvolutionProps {
    evolutionChain: PopUpInfoPokemon[];
    haveEvolution: boolean;
    haveNextEvolution: boolean;
}

export function Evolution({ evolutionChain, haveEvolution, haveNextEvolution }:EvolutionProps) {

    return (
        <EvolutionContainer>
            <h3>Evolution Chain</h3>
            <EvolutionContent>
                <h4>First Stage</h4>
                <EvolutionFirst>
                    {evolutionChain.map((pokemon) => (
                        pokemon.evolutionRank === 1 ? 
                            <EvolutionInfo key={pokemon.name}>
                                <EvolutionImage src={pokemon.image} alt={pokemon.name} />
                                <EvolutionText>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</EvolutionText>
                            </EvolutionInfo>
                        : null
                    ))}
                </EvolutionFirst>
                {haveEvolution === true ? <h4>Second Stage</h4> : null}
                <EvolutionSecond>
                {evolutionChain.map((pokemon) => (
                    pokemon.evolutionRank === 2 ?
                        <EvolutionInfo key={pokemon.name}>
                            <EvolutionImage src={pokemon.image} alt={pokemon.name} />
                            <EvolutionText>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</EvolutionText>
                        </EvolutionInfo> 
                    : null
                ))}
                </EvolutionSecond>
                {haveNextEvolution === true ? <h4>Third Stage</h4> : null}
                <EvolutionThird>
                    {evolutionChain.map((pokemon) => (
                        pokemon.evolutionRank === 3 ?
                            <EvolutionInfo key={pokemon.name}>
                                <EvolutionImage src={pokemon.image} alt={pokemon.name} />
                                <EvolutionText>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</EvolutionText>
                            </EvolutionInfo>
                        : null
                    ))}
                </EvolutionThird>
            </EvolutionContent>
        </EvolutionContainer>
    );
};