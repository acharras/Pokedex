import styled from 'styled-components';
import { PopUpInfoPokemon } from './popUpInfo';

const StatsContainer = styled.div `
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-left: 5%;
    margin-top: 5%;
`;

const StatContent = styled.div `
    display : flex;
    flex-direction: row;
    justify-content: space-around;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    margin-bottom: 20px;
`;

const StatInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`;

const StatsText = styled.li `
    margin: 10px;
    font-size: 80%;

    @media (min-width:768px) {
        font-size: 100%;
    }
`;


const TypeContent = styled.div`
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
        font-size: 80%;
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
    width: 25%;
    height: 25px;
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


interface StatsProps {
    selectedPokemon: PopUpInfoPokemon;
    stats: { base_stat: number; stat: { name: string } }[];
}

export function Stats({ selectedPokemon, stats }:StatsProps) {

    return (
        <StatsContainer>
            <StatContent>
                <StatInfo>
                {stats.map((array: { base_stat: number; stat: { name: string } }, index:number) => (
                    index < 3 ? 
                        <StatsText key={array.stat.name}><strong>{array.stat.name}:</strong> {array.base_stat}</StatsText>
                    : null
                ))}
                </StatInfo>
                <StatInfo>
                {stats.map((array: { base_stat: number; stat: { name: string } }, index:number) => (
                    index > 2 ? 
                        <StatsText key={array.stat.name}><strong>{array.stat.name}:</strong> {array.base_stat}</StatsText>
                    : null
                ))}
                </StatInfo>
            </StatContent>
            <TypeContent>
                {selectedPokemon.typeNames.map((name) => (
                    <Type type={name} key={name}>
                        <SpanType>{name.toUpperCase()}</SpanType>
                    </Type>
                ))}
            </TypeContent>
        </StatsContainer>
    );
};