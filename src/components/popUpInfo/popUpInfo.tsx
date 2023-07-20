import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../App';
import styled, { keyframes } from 'styled-components';
import { useDispatch } from 'react-redux';
import { addFavoritePokemon, removeFavoritePokemon } from '../../reducers/actions/index';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers/reducer/types';
import { connect } from 'react-redux';
import { ButtonCard } from './buttonCard';
import { Card } from './card';
import { About } from './about';
import { Location } from './location'
import { Stats } from './stats';
import { Move } from './move';
import { HeldItem } from './heldItem';
import { Ability } from './ability';
import { Form } from './form';
import { Evolution } from './evolution';


const blink = keyframes `
    from {
        background: #eee;
    }
    to {
        background: #e74c3c;
    }
`;

const shake = keyframes `
    0 { transform: translate(0, 0) rotate(0); }
    20% { transform: translate(-10px, 0) rotate(-20deg); }
    30% { transform: translate(10px, 0) rotate(20deg); }
    50% { transform: translate(-10px, 0) rotate(-10deg); }
    60% { transform: translate(10px, 0) rotate(10deg); }
    100% { transform: translate(0, 0) rotate(0); }
`;

const fall = keyframes `
    0% { top: -200px }
    60% { top: 0 }
    80% { top: -20px }
    100% { top: 0 }
`;


const slideUp = keyframes `
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
`;

const slideDown = keyframes `
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(100%);
    }
`;


const PoPUpContainer = styled.div<{$ispopupinfoopen: string}>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    transition: top 0.3s eas-in-out;
    
    animation: ${({ $ispopupinfoopen }) => ($ispopupinfoopen === 'true' ? slideUp : slideDown)} 0.3s ease-in-out;
`;

const PoPUpContent = styled.div`
    display: flex;
    width: 100vw;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    background-color: white;
    
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    position: relative;
    

    @media (min-width:768px) {
        width: 50vw;
        max-height: 80vh;
        border-radius: 10px;
    }
`;


const DivContent = styled.div<{$active: string}>`
    display: ${({ $active }) => ($active === 'true' ? 'flex' : 'none')};
    flex-direction: column;
    height: 60%;
    width: 100%;
    overflow-y: scroll;

    &::-webkit-scrollbar {
        height: 10px;
        width: 10px;
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

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    left: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    width: 30px;
    height: 30px;
`;

const CloseIcon = styled.span`
    display: block;
    position: relative;
    width: 100%;
    height: 100%;

    &::before,
    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #000;
        transform: translateY(-50%);
    }

    &::before {
        transform: rotate(45deg);
    }

    &::after {
        transform: rotate(-45deg);
    }
`;




const Loading = styled.div`
    *, *:before, *:after {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 110px;
    transform: translate(-50%,-50%);
`;

const Pokeball = styled.div `
    position: relative;
    width: 200px;
    height: 200px;
    background: #fff;
    border: 10px solid #000;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: inset -10px 10px 0 10px #ccc;
    animation:  ${fall} .25s ease-in-out,
                ${shake} 1.25s cubic-bezier(.36,.07,.19,.97) infinite;

`;

const PokeballBeforeAfter = styled.div`
    position: absolute;
`;

const PokeballBefore = styled(PokeballBeforeAfter)`
    background: red;
    width: 100%;
    height: 50%;
`;

const PokeballAfter = styled(PokeballBeforeAfter)`
    top: calc(50% - 10px);
    width: 100%;
    height: 20px;
    background: #000;
`;

const PokeballButton = styled.div `
    position: absolute;
    top: calc(50% - 30px);
    left: calc(50% - 30px);
    width: 60px;
    height: 60px;
    background: #7f8c8d;
    border: 10px solid #fff;
    border-radius: 50%;
    z-index: 10;
    box-shadow: 0 0 0 10px black;
    animation: ${blink} .5s alternate infinite;
`;
  

export interface PopUpInfoPokemon {
    name: string;
    url: string;
    image: string;
    typeNames: string[];
    gameIndex: number;
    evolutionRank: number;
}

interface PopupProps {
    selectedPokemon: PopUpInfoPokemon | null;
    onClosePopUpInfo: () => void;
    isPopUpInfoOpen: boolean;
}

export function PopUpInfo({ selectedPokemon, isPopUpInfoOpen, onClosePopUpInfo }:PopupProps) {
    const [moveDetails, setMoveDetails] = useState<Record<string, string>>({});
    const [abilityDetails, setAbilityDetails] = useState<Record<string, string>>({});
    const [formsImage, setFormsImage] = useState<Record<string, string>>({});
    const [description, setDescription] = useState<string>('');
    const [location, setLocation] = useState<string[]>([]);
    const [height, setHeight] = useState<number>(0);
    const [weight, setWeight] = useState<number>(0);
    const [malePercentage, setMalePercentage] = useState<string | number>(0);
    const [femalePercentage, setFemalePercentage] = useState<string | number>(0);
    const [capturePercentage, setcapturePercentage] = useState<string | number>(0);
    const [evolutionChain, setEvolutionChain] = useState<PopUpInfoPokemon[]>([]);
    const [isBaby, setIsBaby] = useState<boolean>();
    const [isLegendary, setIsLegendary] = useState<boolean>();
    const [isMythical, setIsMythical] = useState<boolean>();
    const [hatchSteps, setHatchSteps] = useState<number>(0);
    const [eggGroup, setEggGroup] = useState<string[]>([]);
    const [shape, setShape] = useState<string[]>([]);
    const [generation, setGeneration] = useState<string[]>([]);
    const [genus, setGenus] = useState<string[]>([]);
    const [heldItems, setHeldItems] = useState<{ item: { name: string } }[]>([]);
    const [stats, setStats] = useState<{ base_stat: number; stat: { name: string } }[]>([]);
    const [abilities, setAbilities] = useState<{ ability : { name : string; url : string }}[]>([]);
    const [forms, setForms] = useState<{ name : string; url : string }[]>([]);
    const [moves, setMoves] = useState<{ move: { name: string; url: string }}[]>([]);
    const [activeButton, setActiveButton] = useState('about');
    const [haveEvolution, setHaveEvolution] = useState<boolean>(false);
    const [haveNextEvolution, setHaveNextEvolution] = useState<boolean>(false);
    const [locationNumber, setLocationNumber] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const favoritePokemons = useSelector((state: RootState) => state.favorites);
    

    useEffect(() => {
        if (selectedPokemon) {
            const fetchPokemonData = async () => {
                try {
                    const response = await axios.get(apiUrl + `pokemon-species/${selectedPokemon.gameIndex}`);
                    const pokemonData = response.data;
                    const infoResponse = await axios.get(apiUrl + `pokemon/${selectedPokemon.name}`)
                    const infoData= infoResponse.data;

                    const flavorTextEntries = pokemonData.flavor_text_entries.filter(
                        (entry: { language: { name: string } }) => entry.language.name === 'en'
                      );
                    const description = flavorTextEntries[0].flavor_text;
                    const height = infoData.height / 10;
                    const weight = infoData.weight / 10;
                    const genderRate = pokemonData.gender_rate;
                    const malePercentage = genderRate === -1 ? 'Genderless' : ((8 - genderRate) / 8) * 100;
                    const femalePercentage = genderRate === -1 ? 'Genderless' : (genderRate / 8) * 100;
                    const capturePercentage = Math.round(((pokemonData.capture_rate / 255) * 100) * 100) / 100;
                    const isBaby = pokemonData.is_baby;
                    const isLegendary = pokemonData.is_legendary;
                    const isMythical = pokemonData.is_mythical;
                    const hatchSteps = pokemonData.hatch_counter * 255;
                    const eggGroup = pokemonData.egg_groups.map((group: {name: string}) => ( group.name ))
                    const shape = pokemonData.shape ? pokemonData.shape.name : "looking like nothing";
                    const generation = pokemonData.generation.name.replace(/-/g, ' ').replace(/^(.*?\s)(.*)$/, (match:string, firstPart:string, secondPart:string) => {
                        return firstPart + secondPart.toUpperCase();
                      });
                    const genera = pokemonData.genera.filter(
                        (entry: { language: { name: string } }) => entry.language.name === 'en'
                      );
                    const genus = genera[0].genus;
                    const heldItems = infoData.held_items;
                    const stats = infoData.stats;
                    const abilities = infoData.abilities;
                    const forms = infoData.forms;
                    const moves = infoData.moves;

                    setDescription(description);
                    setHeight(height);
                    setWeight(weight);
                    setMalePercentage(malePercentage);
                    setFemalePercentage(femalePercentage);
                    setcapturePercentage(capturePercentage);
                    setIsBaby(isBaby);
                    setIsLegendary(isLegendary);
                    setIsMythical(isMythical);
                    setHatchSteps(hatchSteps);
                    setEggGroup(eggGroup);
                    setShape(shape);
                    setGeneration(generation);
                    setGenus(genus);
                    setHeldItems(heldItems);
                    setStats(stats);
                    setAbilities(abilities);
                    setForms(forms);
                    setMoves(moves);

                    const fetchEvolution = async (pokemonData:any) => {
                        try {
                            const evolutionChainUrl = pokemonData.evolution_chain.url;
                        
                            const evolutionChainResponse = await axios.get(evolutionChainUrl);
                            const evolutionChainData = evolutionChainResponse.data;
                            const chain = parseEvolutionChain(evolutionChainData.chain);
                            const evolutionChain = await fetchPokemonEvolutionChain(chain);
                            setEvolutionChain(evolutionChain);
                        
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    fetchEvolution(pokemonData);
                
                    const fetchLocation = async (infoData:any) => {
                        try {
                            const locationEntries = infoData.location_area_encounters;
                            const locationResponse = await axios.get(locationEntries);
                            const location = locationResponse.data.map((array: { location_area: { name: string } }) => array.location_area.name.charAt(0).toUpperCase() + array.location_area.name.slice(1).replace(/-/g, ' ') );
                            setLocation(location);
                            setLocationNumber(location.length);
                        } catch (error) {
                            console.log(error);
                        }
                    };
                    fetchLocation(infoData);
                

                    infoData.moves.forEach((array: { move: { name: string; url: string } }) => {
                        const fetchMoveDetails = async () => {
                            try {
                                const response = await axios.get(array.move.url);
                                const moveData = response.data;
                                const effectEntry = moveData.effect_entries.find(
                                    (entry: { language: { name: string } }) => entry.language.name === 'en'
                                );
                                const effectChance = moveData.effect_chance;
                                const effect = effectEntry ? effectEntry.effect : '';
                                const finalEffect = effect.replace(/\$.*?%/g, `${effectChance}%`);
                                
                                setMoveDetails((prevMoveDetails) => ({
                                    ...prevMoveDetails,
                                    [array.move.name]: finalEffect
                                }));

                            } catch (error) {
                                console.log(error);
                            }
                        };
                        fetchMoveDetails();  
                    });
                
                    infoData.forms.forEach((array: { name: string; url: string }) => {
                        const fetchFormsImage = async () => {
                            try {
                                const response = await axios.get(array.url);
                                const formsData = response.data;
                                const spriteUrl = formsData.sprites.front_default;
                                setFormsImage((prevFormDetails) => ({
                                    ...prevFormDetails,
                                    [array.name]: spriteUrl
                                }));
                            } catch (error) {
                                console.log(error);
                            }
                        };
                        fetchFormsImage();
                    });
                
                    infoData.abilities.forEach((array: { ability: { name: string; url: string } }) => {
                        const fetchAbilityDetails = async () => {
                            try {
                                const response = await axios.get(array.ability.url);
                                const abilitiesData = response.data;
                                const effectEntry = abilitiesData.effect_entries.find(
                                    (entry: { language: { name: string } }) => entry.language.name === 'en'
                                );
                                const effect = effectEntry ? effectEntry.effect : '';
                                setAbilityDetails((prevAbilityDetails) => ({
                                    ...prevAbilityDetails,
                                    [array.ability.name]: effect
                                }));
                            } catch (error) {
                                console.log(error);
                            }
                        };
                        fetchAbilityDetails(); 
                    });
                } catch (error) {
                    console.log(error);
                }
            };
            fetchPokemonData();
            setIsLoaded(true);
        }
    }, [selectedPokemon]);

    if (!selectedPokemon) {
        return null;
    }

    const parseEvolutionChain = (chain:any) => {
        const evolves_to = chain.evolves_to && chain.evolves_to.length > 0 ? chain.evolves_to.map((evolves:any) => ({
            species : evolves.species,
            evolves_to: evolves.evolves_to && evolves.evolves_to.length > 0 ? evolves.evolves_to.map((nextEvolves:any) => ({
                species: nextEvolves.species,
                evolves_to: nextEvolves.evolves_to && nextEvolves.evolves_to.length > 0 ? nextEvolves.evolves_to[0] : null, 
            })) : null,
        })): null;

        return {
            species : chain.species,
            evolves_to : evolves_to ? evolves_to : [],
        };
    };

    const fetchPokemonEvolutionChain = async (chain:any): Promise<PopUpInfoPokemon[]> => {
        const evolutionChain: PopUpInfoPokemon[] = [];
        const species = chain.species;
        const speciesUrl = species.url.split("/");
        const pokemondataResponse = await axios.get(apiUrl + `pokemon/${speciesUrl[speciesUrl.length - 2]}`);
        const pokemonData = pokemondataResponse.data;
        const pokemonImageUrl =  pokemonData.sprites.front_default;
        const pokemon: PopUpInfoPokemon = {
            name : species.name,
            url : species.url,
            image : pokemonImageUrl,
            typeNames : [],
            gameIndex : species.gameIndex,
            evolutionRank : 1,
        };
        setHaveEvolution(false);
        setHaveNextEvolution(false);
        evolutionChain.push(pokemon);
        if (chain.evolves_to.length !== 0) {
            for (const evolvesTo of chain.evolves_to){
                const evolvesToSpecies = evolvesTo.species;
                const evolvesToSpeciesUrl = evolvesToSpecies.url.split("/");
                const evolvesToPokemonDataResponse = await axios.get(apiUrl + `pokemon/${evolvesToSpeciesUrl[evolvesToSpeciesUrl.length - 2]}`);
                const evolvesToPokemonData = evolvesToPokemonDataResponse.data;
                const evolvesToPokemonImageUrl = evolvesToPokemonData.sprites.front_default;
                const evolvesToPokemon: PopUpInfoPokemon = {
                    name : evolvesToSpecies.name,
                    url : evolvesToSpecies.url,
                    image : evolvesToPokemonImageUrl,
                    typeNames : [],
                    gameIndex : evolvesToSpecies.gameIndex,
                    evolutionRank: 2,
                }
                setHaveEvolution(true);
                evolutionChain.push(evolvesToPokemon);
                
                if (evolvesTo.evolves_to && evolvesTo.evolves_to.length !== 0) {
                    for (const evolvesToNext of evolvesTo.evolves_to) {
                        const evolvesToNextSpecies = evolvesToNext.species;
                        const evolvesToNextSpeciesUrl = evolvesToNextSpecies.url.split("/");
                        const evolvesToNextPokemonDataResponse = await axios.get(apiUrl + `pokemon/${evolvesToNextSpeciesUrl[evolvesToNextSpeciesUrl.length - 2]}`);
                        const evolvesToNextPokemonData = evolvesToNextPokemonDataResponse.data;
                        const evolvesToNextPokemonImageUrl = evolvesToNextPokemonData.sprites.front_default;
                        const evolvesToNextPokemon: PopUpInfoPokemon = {
                            name : evolvesToNextSpecies.name,
                            url : evolvesToNextSpecies.url,
                            image : evolvesToNextPokemonImageUrl,
                            typeNames : [],
                            gameIndex : evolvesToNextSpecies.gameIndex,
                            evolutionRank: 3,
                        }
                        evolutionChain.push(evolvesToNextPokemon);
                        setHaveNextEvolution(true);
                    }
                }
            }
        }
        return evolutionChain;
    };

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };

    const handleFavorites = (pokemon: PopUpInfoPokemon) => {
        if (favoritePokemons && favoritePokemons.favorites.length > 0) {
            const isPokemonFavorite = favoritePokemons.favorites.some((fav) => fav.name === pokemon.name);
            
            if (isPokemonFavorite) {
              dispatch(removeFavoritePokemon(pokemon));
            } else {
              dispatch(addFavoritePokemon(pokemon));
            }
        } else {
            dispatch(addFavoritePokemon(pokemon));
        }
    };  

    


    return (
        <PoPUpContainer $ispopupinfoopen={isPopUpInfoOpen ? 'true' : 'false'}>
            {isLoaded === true ? (
                <>
            <PoPUpContent>
                <CloseButton onClick={() => {onClosePopUpInfo(); handleButtonClick('about');}}>
                    <CloseIcon />
                </CloseButton>
                <Card selectedPokemon={selectedPokemon} favoritePokemons={favoritePokemons} handleFavorites={handleFavorites}/>
                <ButtonCard activeButton={activeButton} handleButtonClick={handleButtonClick}/>
                <DivContent $active={activeButton === 'about' ? 'true' : 'false'}>
                    <About description={description} isBaby={isBaby} isLegendary={isLegendary} isMythical={isMythical} height={height} weight={weight} malePercentage={malePercentage} femalePercentage={femalePercentage} eggGroup={eggGroup} hatchSteps={hatchSteps} generation={generation} capturePercentage={capturePercentage} shape={shape} genus={genus}  />
                </DivContent>
                <DivContent $active={activeButton === 'evolution' ? 'true' : 'false'}>
                    <Evolution evolutionChain={evolutionChain} haveEvolution={haveEvolution} haveNextEvolution={haveNextEvolution}/>
                </DivContent>
                <DivContent $active={activeButton === 'location' ? 'true' : 'false'}>
                    <Location location={location} locationNumber={locationNumber}/>
                </DivContent>
                <DivContent $active={activeButton === 'stats' ? 'true' : 'false'}>
                    <Stats selectedPokemon={selectedPokemon} stats={ stats } />
                </DivContent>
                <DivContent $active={activeButton === 'moves' ? 'true' : 'false'}>
                    <Move moves={moves} moveDetails={moveDetails}/>
                </DivContent>
                <DivContent $active={activeButton === 'heldItems' ? 'true' : 'false'}>
                    <HeldItem heldItems={heldItems}/>
                </DivContent>
                <DivContent $active={activeButton === 'forms' ? 'true' : 'false'}>
                    <Form forms={forms} formsImage={formsImage} />
                </DivContent>
                <DivContent $active={activeButton === 'abilities' ? 'true' : 'false'}>
                    <Ability abilities={abilities} abilityDetails={abilityDetails} />
                </DivContent>
              </PoPUpContent>
            </>
           ) : (
           <Loading ><Pokeball><PokeballBefore /><PokeballAfter /><PokeballButton /></Pokeball></Loading>
           )}
        </PoPUpContainer>
    );
};


const mapStateToProps = (state: RootState) => ({
    favoritePokemons: state.favorites.favorites,
  });
  
export default connect(mapStateToProps)(PopUpInfo);