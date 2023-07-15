import "./popUpInfo.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../App';

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

    useEffect(() => {
        if (selectedPokemon) {
            const fetchPokemonData = async () => {
                try {
                    const response = await axios.get(apiUrl + `pokemon-species/${selectedPokemon.name}`);
                    const pokemonData = response.data;
                    const flavorTextEntries = pokemonData.flavor_text_entries.filter(
                        (entry: { language: { name: string } }) => entry.language.name === 'en'
                      );
                    const description = flavorTextEntries[0].flavor_text;
                    setDescription(description);

                    const infoResponse = await axios.get(apiUrl + `pokemon/${selectedPokemon.name}`)
                    const infoData= infoResponse.data;

                    const height = infoData.height / 10;
                    const weight = infoData.weight / 10;
                    const genderRate = pokemonData.gender_rate;
                    const malePercentage = genderRate === -1 ? 'Genderless' : ((8 - genderRate) / 8) * 100;
                    const femalePercentage = genderRate === -1 ? 'Genderless' : (genderRate / 8) * 100;
                    const capturePercentage = Math.round(((pokemonData.capture_rate / 255) * 100) * 100) / 100;

                    setHeight(height);
                    setWeight(weight);
                    setMalePercentage(malePercentage);
                    setFemalePercentage(femalePercentage);
                    setcapturePercentage(capturePercentage);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchPokemonData();
            
            const fetchEvolution = async () => {
                try {
                    const response = await axios.get(apiUrl + `pokemon-species/${selectedPokemon.name}`);
                    const speciesData = response.data;
                    const evolutionChainUrl = speciesData.evolution_chain.url;

                    const evolutionChainResponse = await axios.get(evolutionChainUrl);
                    const evolutionChainData = evolutionChainResponse.data;
                    const chain = parseEvolutionChain(evolutionChainData.chain);
                    console.log(chain)
                    const evolutionChain = await fetchPokemonEvolutionChain(chain);
                    setEvolutionChain(evolutionChain);

                } catch (error) {
                    console.log(error);
                }
            }
            fetchEvolution();
        
            const fetchLocation = async () => {
                try {
                    const response = await axios.get(apiUrl + `pokemon/${selectedPokemon.name}`);
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
                        const moveData = response.data;
                        const effectEntry = moveData.effect_entries.find(
                            (entry: { language: { name: string } }) => entry.language.name === 'en'
                        );
                        const effect = effectEntry ? effectEntry.effect : '';
                        setMoveDetails((prevMoveDetails) => ({
                            ...prevMoveDetails,
                            [array.move.name]: effect
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
        const evolves_to = chain.evolves_to.length > 0 ? chain.evolves_to[0] : null;
        const evolves_to_to = evolves_to ? (evolves_to.evolves_to.length > 0 ? evolves_to.evolves_to[0] : null) : null;

        return {
            species : chain.species,
            evolves_to : evolves_to ? evolves_to : [],
            evolves_to_to: evolves_to_to ? evolves_to_to : [], 
        };
    };

    const fetchPokemonEvolutionChain = async (chain:any): Promise<PopUpInfoPokemon[]> => {
        const evolutionChain: PopUpInfoPokemon[] = [];
        const species = chain.species;
        const pokemondataResponse = await axios.get(apiUrl + `pokemon/${species.name}`);
        const pokemonData = pokemondataResponse.data;
        
        const pokemonImageUrl =  pokemonData.sprites.front_default;
        const pokemon: PopUpInfoPokemon = {
            name : species.name,
            url : species.url,
            image : pokemonImageUrl,
            typeNames : [],
            gameIndex : 0,
            pokemonData : null,
        };
        evolutionChain.push(pokemon);
        if (chain.evolves_to.length !== 0) {
            const evolvesTo = chain.evolves_to;
                const evolvesToSpecies = evolvesTo.species;
                const evolvesToPokemonDataResponse = await axios.get(apiUrl + `pokemon/${evolvesToSpecies.name}`);
                const evolvesToPokemonData = evolvesToPokemonDataResponse.data;
                const evolvesToPokemonImageUrl = evolvesToPokemonData.sprites.front_default;
                const evolvesToPokemon: PopUpInfoPokemon = {
                    name : evolvesToSpecies.name,
                    url : evolvesToSpecies.url,
                    image : evolvesToPokemonImageUrl,
                    typeNames : [],
                    gameIndex : 0,
                    pokemonData : null,
                }
                evolutionChain.push(evolvesToPokemon);
                if (chain.evolves_to_to.length !== 0) {
                    const evolvesToNext = chain.evolves_to_to;
                    const evolvesToNextSpecies = evolvesToNext.species;
                    const evolvesToNextPokemonDataResponse = await axios.get(apiUrl + `pokemon/${evolvesToNextSpecies.name}`);
                    const evolvesToNextPokemonData = evolvesToNextPokemonDataResponse.data;
                    const evolvesToNextPokemonImageUrl = evolvesToNextPokemonData.sprites.front_default;
                    const evolvesToNextPokemon: PopUpInfoPokemon = {
                        name : evolvesToNextSpecies.name,
                        url : evolvesToNextSpecies.url,
                        image : evolvesToNextPokemonImageUrl,
                        typeNames : [],
                        gameIndex : 0,
                        pokemonData : null,
                    }
                    evolutionChain.push(evolvesToNextPokemon);
                }
            }
        return evolutionChain;
    };



    return (
        <div className="Popup">
            <div className="PopupContent">
                <h2>{selectedPokemon.name} #{selectedPokemon.gameIndex}</h2>
                <img src={selectedPokemon.image} alt={selectedPokemon.name} />
                <p>{description}</p>
                {/*<p>
                    Height: {height} cm<br />
                    Weight: {weight} kg<br />
                    {malePercentage === 'Genderless' ? (
                        <span>Gender: {malePercentage}<br /></span>
                    ) : (
                    <>
                        Male Percentage: {malePercentage}%<br />
                        Female Percentage: {femalePercentage}%<br />
                    </>
                    )}
                    Capture Percentage: {capturePercentage}%
                    </p>*/}
                <h3>Evolution Chain</h3>
                <ul className="EvolutionChain">
                    {evolutionChain.map((pokemon) => (
                        <li key={pokemon.name} className="Evolution">
                            <img src={pokemon.image} alt={pokemon.name} />
                            <strong>{pokemon.name}</strong>
                        </li>
                    ))}
                </ul>
                {location.length > 0 && (
                    <div>
                        <h3>Locations:</h3>
                        <ul>
                            {location.map((location) => (
                                <li key={location}>{location}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <ul>
                    {selectedPokemon.typeNames.map((type) => (
                        <li key={type}>{type}</li>
                    ))}
                </ul>
                <ul>
                    {selectedPokemon.pokemonData.stats.map((array: { base_stat: number; stat: { name: string } }) => (
                        <li key={array.stat.name}>
                            <strong>{array.stat.name}:</strong> {array.base_stat}
                        </li>
                    ))}
                </ul>
                {/*<ul>
                    {selectedPokemon.pokemonData.moves.map((array: { move: { name: string; url: string } }) => (
                        <li key={array.move.name}>
                            <strong>{array.move.name}</strong>
                            {moveDetails[array.move.name] && <p>{moveDetails[array.move.name]}</p>}
                        </li>
                    ))}
                    </ul>*/}
                <ul>
                    {selectedPokemon.pokemonData.held_items.length > 0 ? (
                        <ul>
                            {selectedPokemon.pokemonData.held_items.map((array: { item: { name: string } }) => (
                                <li key={array.item.name}>{array.item.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>This Pokémon doesn't hold any items...</p>
                    )}
                </ul>
                <ul>
                    {selectedPokemon.pokemonData.forms.map((array : { name : string; url : string }) => (
                        <li key={array.name}>
                            {formsImage[array.name] && <img src={formsImage[array.name]} alt={array.name} ></img>}
                        </li>
                    ))}
                    </ul>
                <ul>
                    {selectedPokemon.pokemonData.abilities.map((array : { ability : { name : string; url : string }}) => (
                        <li key={array.ability.name}>
                            <strong>{array.ability.name}</strong>
                            {abilityDetails[array.ability.name] && <p>{abilityDetails[array.ability.name]}</p>}
                        </li>
                    ))}
                </ul>
                <button onClick={onClosePopUpInfo}>Fermer</button>
              </div>
        </div>
    );
};