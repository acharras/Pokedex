import styled from 'styled-components';

const AboutContent = styled.div `
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-left: 5%;
`;

const AboutInfo = styled.div `
    display : flex;
    flex-direction: row;
    justify-content: space-around;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    margin-bottom: 20px;
`;

const AboutInfoText = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;
`;

const AboutTextOpacity = styled.p `
    color: rgba(46, 48, 87, 0.6);
`;

interface AboutProps {
    description: string;
    isBaby: boolean | undefined;
    isLegendary: boolean | undefined;
    isMythical: boolean | undefined;
    height: number;
    weight: number;
    malePercentage: string | number;
    femalePercentage: string | number;
    eggGroup: string[];
    hatchSteps: number;
    generation: string[];
    capturePercentage: string | number;
    shape: string[];
    genus: string[];
}

export function About({ description, isBaby, isLegendary, isMythical, height, weight, malePercentage, femalePercentage, eggGroup, hatchSteps, generation, capturePercentage, shape, genus }:AboutProps) {
    

    return (
        <AboutContent>
            <p>{description}</p>
            {isBaby ? (
                <p>This pokemon is a baby...</p>
            ) : null}
            {isLegendary ? (
               <p>This pokemon is a legendary one !</p>
            ) : null}
            {isMythical ? (
               <p>This pokemon is a mythical one !</p>
            ) : null}
            <AboutInfo>
                <AboutInfoText>
                    <AboutTextOpacity>Height</AboutTextOpacity><p>{height} m </p>
                </AboutInfoText>
                <AboutInfoText>
                    <AboutTextOpacity>Weight</AboutTextOpacity><p>{weight} kg ({(weight * 2.2).toFixed(1)} lbs)</p>
                </AboutInfoText>
            </AboutInfo>
            {malePercentage === 'Genderless' ? (
                <AboutInfo>
                    <p>This pokemon is {malePercentage.toLowerCase()}</p>
                </AboutInfo>
            ) : (
            <>
                <AboutInfo>
                    <AboutInfoText>
                        <AboutTextOpacity>Male percentage</AboutTextOpacity><p>{malePercentage}%</p>
                    </AboutInfoText>
                    <AboutInfoText>
                        <AboutTextOpacity>Female percentage</AboutTextOpacity><p>{femalePercentage}%</p>
                    </AboutInfoText>
                </AboutInfo>
            </>
            )}
            <AboutInfo>
                <AboutInfoText>
                    <AboutTextOpacity>Egg group</AboutTextOpacity><p>{eggGroup.join(", ")}</p>
                </AboutInfoText>
                <AboutInfoText>
                    <AboutTextOpacity>Hatch setps</AboutTextOpacity><p>{hatchSteps}</p>
                </AboutInfoText>
            </AboutInfo>
            <AboutInfo>
                <AboutInfoText>
                    <AboutTextOpacity>Generation</AboutTextOpacity><p>{generation}</p>
                </AboutInfoText>
                <AboutInfoText>
                    <AboutTextOpacity>Capture percentage</AboutTextOpacity><p>{capturePercentage}%</p>
                </AboutInfoText>
            </AboutInfo>
            <AboutInfo>
                <AboutInfoText>
                    <AboutTextOpacity>Shape</AboutTextOpacity><p>{shape}</p>
                </AboutInfoText>
                <AboutInfoText>
                    <AboutTextOpacity>Genus</AboutTextOpacity><p>{genus}</p>
                </AboutInfoText>
            </AboutInfo>
        </AboutContent>
    );
};