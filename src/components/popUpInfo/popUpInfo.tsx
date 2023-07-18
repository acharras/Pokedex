import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../App';
import styled from 'styled-components';

const PoPUpContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    z-index: 10;
`;

const PoPUpContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    
    @media (min-width:768px) {
        width: 50vw;
        max-height: 80vh;
        overflow-y: auto;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

const Button = styled.button<{active: string}>`
    margin: 5px;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background-color: ${({ active }) => (active === 'true' ? 'lightblue' : 'lightgray')};
    color: ${({ active }) => (active === 'true' ? 'black' : 'gray')};
    cursor: pointer;
`;

const DivContent = styled.div<{active: string}>`
    display: ${({ active }) => (active === 'true' ? 'block' : 'none')};
    margin: 10px;
    padding: 10px;
    background-color: lightblue;
`;

export interface PopUpInfoPokemon {
    name: string;
    url: string;
    image: string;
    typeNames: string[];
    gameIndex: number;
    pokemonData: any;
}

interface PopupProps {
    selectedPokemon: PopUpInfoPokemon | null;
    onClosePopUpInfo: () => void;
}

export function PopUpInfo({ selectedPokemon, onClosePopUpInfo }:PopupProps) {
    
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
                    const generation = pokemonData.generation.name;
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
                    const location = locationResponse.data.map((array: { location_area: { name: string } }) => array.location_area.name);
                    setLocation(location);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchLocation();

            selectedPokemon.pokemonData.moves.forEach((array: { move: { name: string; url: string } }) => {
                const fetchMoveDetails = async () => {
                    try {
                        const response = await axios.get(array.move.url);
                        console.log(response.data);
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
        };
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
                }
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
                        }
                        evolutionChain.push(evolvesToNextPokemon);
                    }
                }
            }
        }
        return evolutionChain;
    };

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };



    return (
        <PoPUpContainer>
            <PoPUpContent>
                <h2>{selectedPokemon.name} #{selectedPokemon.gameIndex}</h2>
                <img src={selectedPokemon.image} alt={selectedPokemon.name} />
                <ButtonContainer>
                    <Button active={activeButton === 'about' ? 'true' : 'false'} onClick={() => handleButtonClick('about')}>About</Button>
                    <Button active={activeButton === 'evolution' ? 'true' : 'false'} onClick={() => handleButtonClick('evolution')}>Evolution</Button>
                    <Button active={activeButton === 'type' ? 'true' : 'false'} onClick={() => handleButtonClick('type')}>Type</Button>
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
                    <Button active={activeButton === 'heldItems' ? 'true' : 'false'} onClick={() => handleButtonClick('heldItems')}>Held items</Button>
                    :null}
                </ButtonContainer>
                <DivContent active={activeButton === 'about' ? 'true' : 'false'}>
                    <p>{description}</p>
                    <p>
                        Height: {height} m<br />
                        Weight: {weight} kg<br />
                        {malePercentage === 'Genderless' ? (
                            <span>Gender: {malePercentage}<br /></span>
                        ) : (
                        <>
                            Male percentage: {malePercentage}%<br />
                            Female percentage: {femalePercentage}%<br />
                        </>
                        )}
                        {isBaby ? (
                            <span>This pokemon is a baby...<br /></span>
                        ) : null}
                        {isLegendary ? (
                            <span>This pokemon is a legendary one !<br /></span>
                        ) : null}
                        {isMythical ? (
                            <span>This pokemon is a mythical one !<br /></span>
                        ) : null}
                        Capture percentage: {capturePercentage}%<br />
                        Hatch setps: {hatchSteps}<br />
                        Egg group : {eggGroup.join(", ")}<br />
                        Shape: {shape}<br />
                        Generation: {generation}<br />
                        Genus: {genus}<br />
                    </p>
                </DivContent>
                <DivContent active={activeButton === 'evolution' ? 'true' : 'false'}>
                    <h3>Evolution Chain</h3>
                    <ul className="EvolutionChain">
                        {evolutionChain.map((pokemon) => (
                            <li key={pokemon.name} className="Evolution">
                                <img src={pokemon.image} alt={pokemon.name} />
                                <strong>{pokemon.name}</strong>
                            </li>
                        ))}
                    </ul>
                </DivContent>
                <DivContent active={activeButton === 'location' ? 'true' : 'false'}>
                    <h3>Locations:</h3>
                    <ul>
                        {location.map((location) => (
                            <li key={location}>{location}</li>
                        ))}
                    </ul>
                </DivContent>
                <DivContent active={activeButton === 'type' ? 'true' : 'false'}>
                    <ul>
                        {selectedPokemon.typeNames.map((type) => (
                            <li key={type}>{type}</li>
                        ))}
                    </ul>
                </DivContent>
                <DivContent active={activeButton === 'stats' ? 'true' : 'false'}>
                    <ul>
                        {selectedPokemon.pokemonData.stats.map((array: { base_stat: number; stat: { name: string } }) => (
                            <li key={array.stat.name}>
                                <strong>{array.stat.name}:</strong> {array.base_stat}
                            </li>
                        ))}
                    </ul>
                </DivContent>
                <DivContent active={activeButton === 'moves' ? 'true' : 'false'}>
                    <ul>
                        {selectedPokemon.pokemonData.moves.map((array: { move: { name: string; url: string } }) => (
                            <li key={array.move.name}>
                                <strong>{array.move.name}</strong>
                                {moveDetails[array.move.name] && <p>{moveDetails[array.move.name]}</p>}
                            </li>
                        ))}
                    </ul>
                </DivContent>
                <DivContent active={activeButton === 'heldItems' ? 'true' : 'false'}>
                    <ul>
                        {selectedPokemon.pokemonData.held_items.map((array: { item: { name: string } }) => (
                            <li key={array.item.name}>{array.item.name}</li>
                        ))}
                    </ul>
                </DivContent>
                <DivContent active={activeButton === 'forms' ? 'true' : 'false'}>
                    <ul>
                        {selectedPokemon.pokemonData.forms.map((array : { name : string; url : string }) => (
                            <li key={array.url}>
                                {formsImage[array.name] && <img src={formsImage[array.name]} alt={array.name} ></img>}
                            </li>
                        ))}
                    </ul>
                </DivContent>
                <DivContent active={activeButton === 'abilities' ? 'true' : 'false'}>
                    <ul>
                        {selectedPokemon.pokemonData.abilities.map((array : { ability : { name : string; url : string }}, index:number) => (
                            <li key={`${array.ability.name}-${index}`}>
                                <strong>{array.ability.name}</strong>
                                {abilityDetails[array.ability.name] && <p>{abilityDetails[array.ability.name]}</p>}
                            </li>
                        ))}
                    </ul>
                </DivContent>
                <button onClick={onClosePopUpInfo}>Fermer</button>
              </PoPUpContent>
        </PoPUpContainer>
    );
};