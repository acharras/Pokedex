import styled from 'styled-components';

const LocationContainer = styled.div `
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-left: 5%;
    margin-top: 5%;
    align-items: center;
    justify-content: center;
`;

const LocationContent = styled.div `
    display : flex;
    flex-direction: row;
    justify-content: space-around;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    margin-bottom: 20px;
`;

const LocationInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`;

const LocationText = styled.li `
    margin: 10px;
    font-size: 80%;
    
    @media (min-width:768px) {
        font-size: 100%;
    }
`;

interface LocationProps {
    location: string[];
    locationNumber: number;
}

export function Location({ location, locationNumber }:LocationProps) {
    
    return (
        <LocationContainer>
            {location.length > 0 ? (
            <>
            <LocationContent>
                <LocationInfo>  
                    {location.map((location, index) => (
                        index < (locationNumber / 2) ?
                            <LocationText key={location}>
                                {location}
                            </LocationText>
                        : null
                    ))}
                </LocationInfo>
                <LocationInfo>  
                    {location.map((location, index) => (
                        index > ((locationNumber / 2) - 1) ?
                            <LocationText key={location}>
                                {location}
                            </LocationText>
                        : null
                    ))}
                </LocationInfo>
                
            </LocationContent>
            </>
            ) : (
                <>
                    This Pokemon isn't located...
                </>
            )}
        </LocationContainer>
    );
};