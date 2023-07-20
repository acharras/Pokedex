import styled from 'styled-components';

const ButtonContainer = styled.div`
    display: flex;
    height: 12%;
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

const Button = styled.button<{$active: string}>`
    display: inline-block;
    height: 45px; 
    margin: 10px;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    color: ${({ $active }) => ($active === 'true' ? 'rgb(46, 48, 87)' : 'gray')};
    cursor: pointer;
    background-color: #FFFFFF;
    border-bottom: 3px solid ${({$active}) => ( $active === 'true' ? `rgb(46, 48, 87);` : `rgba(0, 0, 0, 0.3)`)};
    border-left: 1px solid ${({$active}) => ( $active === 'true' ? `rgb(46, 48, 87);` : `rgba(0, 0, 0, 0.3)`)};
    border-top: 1px solid ${({$active}) => ( $active === 'true' ? `rgb(46, 48, 87);` : `rgba(0, 0, 0, 0.3)`)};
    border-right: 3px solid ${({$active}) => ( $active === 'true' ? `rgb(46, 48, 87);` : `rgba(0, 0, 0, 0.3)`)};
    font-weight: bold;
    font-weight: bold;
    font-size: 70%;

    @media  (min-width:250px) {
        font-size: 90%;
    }

    &:hover {
        transform: scale(1.05);
    }
`;


interface ButtonCardProps {
    activeButton: string;
    handleButtonClick: any;
}

export function ButtonCard({ activeButton, handleButtonClick }:ButtonCardProps) {
    
    return (
        <ButtonContainer>
            <Button $active={activeButton === 'about' ? 'true' : 'false'} onClick={() => handleButtonClick('about')}>About</Button>
            <Button $active={activeButton === 'stats' ? 'true' : 'false'} onClick={() => handleButtonClick('stats')}>Stats</Button>
            <Button $active={activeButton === 'moves' ? 'true' : 'false'} onClick={() => handleButtonClick('moves')}>Moves</Button>
            <Button $active={activeButton === 'abilities' ? 'true' : 'false'} onClick={() => handleButtonClick('abilities')}>Abilities</Button>
            <Button $active={activeButton === 'evolution' ? 'true' : 'false'} onClick={() => handleButtonClick('evolution')}>Evolution</Button> 
            <Button $active={activeButton === 'forms' ? 'true' : 'false'} onClick={() => handleButtonClick('forms')}>Forms</Button>
            <Button $active={activeButton === 'location' ? 'true' : 'false'} onClick={() => handleButtonClick('location')}>Location</Button>
            <Button $active={activeButton === 'heldItems' ? 'true' : 'false'} onClick={() => handleButtonClick('heldItems')}>Helditems</Button>
        </ButtonContainer>
    );
};