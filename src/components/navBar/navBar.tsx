import { useState } from 'react'
import styled from 'styled-components';
import { PokemonType } from '../pokemonList/pokemonList'

const NavBarContainer = styled.div`
    display: flex;
    width: 100vw;
    height: 15vh;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 0;
    margin-bottom: 1vh;

    @media (min-width:768px) {
        width: 80vw;
        flex-direction: row;
        align-items: center;
    }
`;

const SearchInput = styled.input `
    background-color: #ffffff;
    border: none;
    border-radius: 3rem;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    color: #333333;
    width: 15rem;
    transition: box-shadow 0.3s ease;
    box-shadow: 0 0 0 2px #ffcb05;
    margin-right: 2rem;
    margin-top : 10px;
    height: 1rem;

    media (min-width:768px) {
        width: 100%;
        max-width: 15vw;
        margin-top : 0px;
    }
`;

const FilterHandler = styled.div `
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-right: 0;
    margin-bottom: 1vh;
    width: 80vw;
    margin-top : 10px;

    @media (min-width:768px) {
        align-items: center;
        margin-top : 0px;
    }
`;

const FilterButton = styled.button`
    background-color: #ffcb05;
    border: none;
    border-radius: 3rem;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    color: #333333;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #ffd900;
    }
`;

const FilterOptions = styled.div<{ isopen : string }> `
    display: ${({isopen}) => ( isopen === 'true' ? 'flex' : 'none')};
    width: 50%;
    height: 35vh;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-left: 1rem;
    z-index: 1;
    overflow-y: scroll;
    flex-direction: column;
    align-items: center;

    media (min-width:768px) {
        flex-wrap: wrap;
        justify-content: space-around;
    }
`;

const FilterOption = styled.div<{ ischoiced : string }>`
    height: 1.5rem;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: background-color 0.3s ease;
    background-color: ${({ischoiced}) => ( ischoiced === 'true' ? `#ffd900` : `none`)};
    &:hover {
        background-color: #f4f4f4;
    }
`;


interface NavBarProps {
    onSearch: (searchTerm: string) => void;
    onFilterTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    pokemonPerPage: number;
    filterType: string;
    typeList: PokemonType[];
}

export function NavBar({ onSearch, onFilterTypeChange, pokemonPerPage, filterType, typeList}:NavBarProps) {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOptionsOpen, setIsFilterOptionsOpen] = useState<boolean>(false)
    

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        event.preventDefault();
        onSearch(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    const handleToggleFilterOptions = () => {
        setIsFilterOptionsOpen(!isFilterOptionsOpen);
      };
    
    const handleSelectFilterOption = (option: string) => {
        onFilterTypeChange({target: {value: option}} as React.ChangeEvent<HTMLSelectElement>);
        setIsFilterOptionsOpen(false);
    };
    

    return (
        <NavBarContainer>
                <form onSubmit={handleSubmit}>
                    <SearchInput
                      type="text"
                      placeholder="Search pokemon"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                </form>
                <FilterHandler>
                    <FilterButton onClick={handleToggleFilterOptions}>Filter</FilterButton>
                    <FilterOptions isopen={isFilterOptionsOpen ? 'true' : 'false'}>
                        <FilterOption ischoiced={filterType === '' ? 'true' : 'false'} onClick={() => handleSelectFilterOption('')}>Tous</FilterOption>
                        {typeList.filter((type) => type.name !== 'unknown' && type.name !== 'shadow').map((type) => (
                            <FilterOption key={type.name} ischoiced={type.name === filterType ? 'true' : 'false'} onClick={() => handleSelectFilterOption(type.name)}>
                              {type.name}
                            </FilterOption>
                        ))}
                    </FilterOptions>
                </FilterHandler>
        </NavBarContainer>
    );
};