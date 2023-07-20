import styled from 'styled-components';

const MoveContainer = styled.div `
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-left: 5%;
    margin-top: 5%;
`;

const MoveContent = styled.div `
    display : flex;
    flex-direction: row;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    margin-bottom: 20px;
`;

const MoveInfo = styled.li `
    display : flex;
    flex-direction: column;
    margin: 5%;
`;

interface MoveProps {
    moves: { move: { name: string; url: string }}[];
    moveDetails: Record<string, string>;
}

export function Move({ moves, moveDetails }:MoveProps) {
    
    return (
        <MoveContainer>
            {moves.map((array: { move: { name: string; url: string } }) => (
                <MoveContent key={array.move.name}>
                    <MoveInfo>
                        <strong>{array.move.name.charAt(0).toUpperCase() + array.move.name.replace(/-/g, ' ').slice(1)}</strong>
                        {moveDetails[array.move.name] && <p>{moveDetails[array.move.name]}</p>}
                    </MoveInfo>
                </MoveContent>
            ))}
        </MoveContainer>
    );
};