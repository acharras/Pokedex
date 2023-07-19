import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../App';
import styled, { keyframes } from 'styled-components';
import { useDispatch } from 'react-redux';
import { addFavoritePokemon, removeFavoritePokemon } from '../../reducers/actions/index';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers/reducer/types';
import { connect } from 'react-redux';

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


const PoPUpContainer = styled.div<{ispopupinfoopen: string}>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    transition: top 0.3s eas-in-out;
    
    animation: ${({ ispopupinfoopen }) => (ispopupinfoopen === 'true' ? slideUp : slideDown)} 0.3s ease-in-out;
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

const PopUpCard = styled.div<{type : string[] }> `
    --normal: rgb(168, 167, 122, 0.8);
    --fire: rgb(238, 129, 48, 0.8);
    --water: rgb(99, 144, 240, 0.8);
    --electric: rgb(247, 208, 44, 0.8);
    --grass: rgb(122, 199, 76, 0.8);
    --ice: rgb(150, 217, 214, 0.8);
    --fighting: rgb(194, 46, 40, 0.8);
    --poison: rgb(163, 62, 161, 0.8);
    --ground: rgb(226, 191, 101, 0.8);
    --flying: rgb(169, 143, 243, 0.8);
    --psychic: rgb(249, 85, 135, 0.8);
    --bug: rgb(166, 185, 26, 0.8);
    --rock: rgb(182, 161, 54, 0.8);
    --ghost: rgb(115, 87, 151, 0.8);
    --dragon: rgb(111, 53, 252, 0.8);
    --dark: rgb(112, 87, 70, 0.8);
    --steel: rgb(183, 183, 206, 0.8);
    --fairy: rgb(214, 133, 173, 0.8);

    display: flex;
    flex-direction: column;
    width: 100%;
    height: 30%;
    background: linear-gradient(
        to right bottom,
        ${({ type }) => (type[0] ? `var(--${type[0]})` : 'none')} 70%,
        ${({ type }) => (type[1] ? `var(--${type[1]})` : `var(--${type[0]})`)} 30%
    );
    background-color: rgba(255, 255, 255, 0.9);
    

    @media (min-width:768px) {
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
    }
`;

const CardImage = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 70%;
`;

const CardText = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    height: 30%;
    align-items: center;
    font-weight: bold;
    font-size: 80%;

    @media (min-width:250px) {
        font-size: 120%;
    }
    
`;

const CardTextInfo = styled.div`
    display: flex;
    flex-direction: row;
    align-items: baseline;
    padding-left: 32px;

    @media (min-width:768px) {
        padding-left: 0px;
    }
`;

const CardIndex = styled.p`
    font-weight: lighter;
    font-size: 80%;

    @media (min-width:250px) {
        font-size: 100%;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    height: 10%;
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

const Button = styled.button<{active: string}>`
    display: inline-block;
    height: 44px; 
    margin: 5px;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background-color: ${({ active }) => (active === 'true' ? '#ffd900' : '#fff')};
    color: ${({ active }) => (active === 'true' ? 'rgb(46, 48, 87)' : 'gray')};
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
    border-bottom: 2px solid rgba(128, 128, 128, 0.3);
    border-left: 2px solid rgba(128, 128, 128, 0.3);
    border-top: 2px solid gray;
    border-right: 2px solid gray;
    font-weight: bold;
    font-size: 70%;

    @media (min-width:250px) {
        font-size: 90%;
    }

    &:hover {
        transform: scale(1.05);
    }
`;

const DivContent = styled.div<{active: string}>`
    display: ${({ active }) => (active === 'true' ? 'flex' : 'none')};
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

const About = styled.div `
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

const Evolution = styled.div `
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

const Stats = styled.div `
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

const TypeContent = styled.div `
    display : flex;
    flex-direction: row;
    justify-content: space-around;
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
    width: 20%;
    height: 100%;
    border-radius: 12px;
    border: solid 4px;
    border-color: #DCBF00;
    align-items: center;
    background-color: ${({ type }) => (type ? `var(--${type})` : 'none')};
`;

const SpanType = styled.div `
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    font-weight: bolder;
    font-size: 80%;
    
    @media (min-width:768px) {
        font-size: 100%;
    }
`;

const Move = styled.div `
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

const Ability = styled.div `
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

const HeldItem = styled.div `
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

const Location = styled.div `
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-left: 5%;
    margin-top: 5%;
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

const FavoriteButton = styled.button`
    background-color: transparent;
    border: none;
    font-size: 32px;
    color: #DCBF00;
    cursor: pointer;
    z-index: 2;
    
`;

const NotFavoriteButton = styled.button`
    background-color: transparent;
    border: none;
    font-size: 32px;
    color: grey;
    cursor: pointer;
    z-index: 2;

`;

export interface PopUpInfoPokemon {
    name: string;
    url: string;
    image: string;
    typeNames: string[];
    gameIndex: number;
    pokemonData: any;
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
    const [formsSwitchable, setFormsSwitchable] = useState<boolean>();
    const [genus, setGenus] = useState<string[]>([]);
    const [activeButton, setActiveButton] = useState('about');
    const [haveEvolution, setHaveEvolution] = useState<boolean>(false);
    const [haveNextEvolution, setHaveNextEvolution] = useState<boolean>(false);
    const [locationNumber, setLocationNumber] = useState<number>(0);
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
                    const formsSwitchable = pokemonData.forms_switchable;
                    const genera = pokemonData.genera.filter(
                        (entry: { language: { name: string } }) => entry.language.name === 'en'
                      );
                    const genus = genera[0].genus;

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
                    setFormsSwitchable(formsSwitchable);
                    setGenus(genus);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchPokemonData();
            
            const fetchEvolution = async () => {
                try {
                    const response = await axios.get(apiUrl + `pokemon-species/${selectedPokemon.gameIndex}`);
                    const speciesData = response.data;
                    const evolutionChainUrl = speciesData.evolution_chain.url;

                    const evolutionChainResponse = await axios.get(evolutionChainUrl);
                    const evolutionChainData = evolutionChainResponse.data;
                    const chain = parseEvolutionChain(evolutionChainData.chain);
                    const evolutionChain = await fetchPokemonEvolutionChain(chain);
                    setEvolutionChain(evolutionChain);

                } catch (error) {
                    console.log(error);
                }
            }
            fetchEvolution();
        
            const fetchLocation = async () => {
                try {
                    const response = await axios.get(apiUrl + `pokemon/${selectedPokemon.gameIndex}`);
                    const pokemonData = response.data;
                    const locationEntries = pokemonData.location_area_encounters;
                    const locationResponse = await axios.get(locationEntries);
                    const location = locationResponse.data.map((array: { location_area: { name: string } }) => array.location_area.name.charAt(0).toUpperCase() + array.location_area.name.slice(1).replace(/-/g, ' ') );
                    setLocation(location);
                    setLocationNumber(location.length);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchLocation();

            selectedPokemon.pokemonData.moves.forEach((array: { move: { name: string; url: string } }) => {
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

            selectedPokemon.pokemonData.forms.forEach((array: { name: string; url: string }) => {
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

            selectedPokemon.pokemonData.abilities.forEach((array: { ability: { name: string; url: string } }) => {
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
            pokemonData : null,
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
                    pokemonData : null,
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
                            pokemonData : null,
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
        <PoPUpContainer ispopupinfoopen={isPopUpInfoOpen ? 'true' : 'false'}>
            <PoPUpContent>
                <CloseButton onClick={() => {onClosePopUpInfo(); handleButtonClick('about')}}>
                    <CloseIcon />
                </CloseButton>
                <PopUpCard type={selectedPokemon.typeNames}>
                    <CardText>
                        <CardTextInfo>
                            <h2>{selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1) }</h2>
                            <CardIndex>#{selectedPokemon.gameIndex.toString().padStart(4, "0")}</CardIndex>
                        </CardTextInfo>
                        {favoritePokemons.favorites && favoritePokemons.favorites.some((fav) => fav.name === selectedPokemon.name) ?
                            <FavoriteButton onClick={() => handleFavorites(selectedPokemon)}>
                                ★
                            </FavoriteButton>
                        :
                            <NotFavoriteButton onClick={() => handleFavorites(selectedPokemon)}>
                                ☆
                            </NotFavoriteButton>
                        }
                    </CardText>
                    <CardImage>
                        <img src={selectedPokemon.image} alt={selectedPokemon.name} />
                    </CardImage>
                </PopUpCard>
                <ButtonContainer>
                    <Button active={activeButton === 'about' ? 'true' : 'false'} onClick={() => handleButtonClick('about')}>About</Button>
                    {haveEvolution === true ? <Button active={activeButton === 'evolution' ? 'true' : 'false'} onClick={() => handleButtonClick('evolution')}>Evolution</Button> : null}
                    <Button active={activeButton === 'stats' ? 'true' : 'false'} onClick={() => handleButtonClick('stats')}>Stats</Button>
                    <Button active={activeButton === 'moves' ? 'true' : 'false'} onClick={() => handleButtonClick('moves')}>Moves</Button>
                    <Button active={activeButton === 'abilities' ? 'true' : 'false'} onClick={() => handleButtonClick('abilities')}>Abilities</Button>
                    {formsSwitchable ? 
                    <Button active={activeButton === 'forms' ? 'true' : 'false'} onClick={() => handleButtonClick('forms')}>Forms</Button>
                    :null}
                    {location.length > 0 ? 
                    <Button active={activeButton === 'location' ? 'true' : 'false'} onClick={() => handleButtonClick('location')}>Location</Button>
                    :null}
                    {selectedPokemon.pokemonData.held_items.length > 0 ? 
                    <Button active={activeButton === 'heldItems' ? 'true' : 'false'} onClick={() => handleButtonClick('heldItems')}>Helditems</Button>
                    :null}
                </ButtonContainer>
                <DivContent active={activeButton === 'about' ? 'true' : 'false'}>
                    <About>
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
                    </About>
                </DivContent>
                <DivContent active={activeButton === 'evolution' ? 'true' : 'false'}>
                    <Evolution>
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
                    </Evolution>
                </DivContent>
                <DivContent active={activeButton === 'location' ? 'true' : 'false'}>
                    <Location>
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
                    </Location>
                </DivContent>
                <DivContent active={activeButton === 'stats' ? 'true' : 'false'}>
                    <Stats>
                        <StatContent>
                            <StatInfo>
                            {selectedPokemon.pokemonData.stats.map((array: { base_stat: number; stat: { name: string } }, index:number) => (
                                index < 3 ? 
                                    <StatsText key={array.stat.name}><strong>{array.stat.name}:</strong> {array.base_stat}</StatsText>
                                : null
                            ))}
                            </StatInfo>
                            <StatInfo>
                            {selectedPokemon.pokemonData.stats.map((array: { base_stat: number; stat: { name: string } }, index:number) => (
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
                    </Stats>
                </DivContent>
                <DivContent active={activeButton === 'moves' ? 'true' : 'false'}>
                    <Move>
                        {selectedPokemon.pokemonData.moves.map((array: { move: { name: string; url: string } }) => (
                            <MoveContent key={array.move.name}>
                                <MoveInfo>
                                    <strong>{array.move.name.charAt(0).toUpperCase() + array.move.name.replace(/-/g, ' ').slice(1)}</strong>
                                    {moveDetails[array.move.name] && <p>{moveDetails[array.move.name]}</p>}
                                </MoveInfo>
                            </MoveContent>
                        ))}
                    </Move>
                </DivContent>
                <DivContent active={activeButton === 'heldItems' ? 'true' : 'false'}>
                    <HeldItem>
                        {selectedPokemon.pokemonData.held_items.map((array: { item: { name: string } }) => (
                            <HeldItemContent key={array.item.name}>
                                <HeldItemInfo>
                                    {array.item.name.charAt(0).toUpperCase() + array.item.name.replace(/-/g, ' ').slice(1)}
                                </HeldItemInfo>
                            </HeldItemContent>
                        ))}
                    </HeldItem>
                </DivContent>
                <DivContent active={activeButton === 'forms' ? 'true' : 'false'}>
                    <FormContent>
                        {selectedPokemon.pokemonData.forms.map((array : { name : string; url : string }) => (
                            <FormInfo key={array.url}>
                                <FormImage src={formsImage[array.name]} alt={array.name} />
                                <FormText>{array.name.charAt(0).toUpperCase() + array.name.replace(/-/g, ' ').slice(1)}</FormText>
                            </FormInfo>
                        ))}
                    </FormContent>
                </DivContent>
                <DivContent active={activeButton === 'abilities' ? 'true' : 'false'}>
                    <Ability>
                        {selectedPokemon.pokemonData.abilities.map((array : { ability : { name : string; url : string }}, index:number) => (
                            <AbilityContent key={`${array.ability.name}-${index}`}>
                                <AbilityInfo>
                                    <strong>{array.ability.name.charAt(0).toUpperCase() + array.ability.name.replace(/-/g, ' ').slice(1)}</strong>
                                    {abilityDetails[array.ability.name] && <p>{abilityDetails[array.ability.name]}</p>}
                                </AbilityInfo>
                            </AbilityContent>
                        ))}
                    </Ability>
                </DivContent>
              </PoPUpContent>
        </PoPUpContainer>
    );
};


const mapStateToProps = (state: RootState) => ({
    favoritePokemons: state.favorites.favorites,
  });
  
export default connect(mapStateToProps)(PopUpInfo);