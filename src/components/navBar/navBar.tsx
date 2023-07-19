import { useState } from 'react'
import styled, { keyframes } from 'styled-components';
import { PokemonType } from '../../App'
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';


const slideLeft = keyframes `
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
`;


const NavBarContainer = styled.div`
    display: flex;
    width: 100vw;
    height: 15vh;
    flex-direction: column;
    align-items: center;
    margin-right: 0;
    margin-bottom: 1vh;
    position: relative;

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
    width: 60vw;

    @media (min-width:768px) {
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
        margin-bottom: 0px;
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

const FilterOptions = styled.div<{ isopen: string }> `
    display: ${({isopen}) => ( isopen === 'true' ? 'flex' : 'none')};
    width: 50%;
    height: 35vh;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-left: 1rem;
    z-index: 3;
    overflow-y: auto;
    flex-direction: column;
    align-items: center;

    @media (min-width:768px) {
        flex-wrap: wrap;
        justify-content: space-around;
        height: 5vh;
        overflow-x: auto;
        overflow-y: hidden;
    }

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

const MenuLogo = styled.div `
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 50vw;
`;

const Logo = styled.h1<{ispage: string}>`
    font-size: 24px;
    cursor: pointer;
    border-bottom: 3px solid ${({ispage}) => ( ispage === 'true' ? `#ffd900` : `rgba(0, 0, 0, 0.3)`)};
`;

const PopupContainer = styled.div<{ isOpen: boolean }>`
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    align-items: flex-end;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid #ccc;
    z-index: 7;

    @media (min-width: 768px) {
        display: none;
    }
`;

const PopupContent = styled.div `
    display:flex;
    flex-direction: column;
    align-items: center;
    width: 60vw;
    height: 50%;
    background-color: #FFFFFF;
    transition: left 0.3s eas-in-out;
    animation: ${slideLeft} 0.3s ease-in-out;
    padding-top: 15%;
    border-bottom-left-radius: 12px;
    border-bottom: 3px solid #ffd900;
    border-left: 3px solid #ffd900;

    @media (min-width: 768px) {
        display: none;
    }
`;

const PopupItem = styled.button<{ispage: string}>`
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding: 5px;
    margin-top: 15%;
    border-bottom: 3px solid ${({ispage}) => ( ispage === 'true' ? `#ffd900` : `rgba(0, 0, 0, 0.3)`)};

`;

const MenuButtonWrapper = styled.button<{isopen:boolean}>`
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 30px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 8;

    span {
        display: block;
        position: relative;
        width: 40px;
        height: 3px;
        background-color: #000;
        transition: transform 0.3s ease;
        margin-bottom: 12px;
    }

    span::before,
    span::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #000;
        transform: translateY(-50%);
    }

    span:nth-child(1) {
        transform: translateY(${({ isopen }) => (isopen ? '7px' : '0')}) rotate(${({ isopen }) => (isopen ? '45deg' : '0')});
    }

    span:nth-child(3) {
        opacity: ${({ isopen }) => (isopen ? '0' : '1')};
    }

    span:nth-child(2) {
        transform: translateY(${({ isopen }) => (isopen ? '-7px' : '0')}) rotate(${({ isopen }) => (isopen ? '-45deg' : '0')});
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
    let history = useHistory();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOptionsOpen, setIsFilterOptionsOpen] = useState<boolean>(false)
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const isMobile = window.innerWidth <= 768;
    const location = useLocation();

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (/^[A-Za-z]+$/.test(event.target.value) || event.target.value === '') {
            setSearchTerm(event.target.value);
            event.preventDefault();
            onSearch(event.target.value);
        }
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
        setIsFilterOptionsOpen(true);
    };

    const handlePopupToggle = () => {
        setIsPopupOpen(!isPopupOpen);
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
            {isMobile === false ? (
                <MenuLogo>
                    <Logo ispage={location.pathname === '/' ? 'true' : 'false'} onClick={() => {return history.push("/")}}>Pokedex</Logo>
                    <Logo ispage={location.pathname === '/favorite' ? 'true' : 'false'} onClick={() => {return history.push("/favorite")}}>Favorite</Logo>
                </MenuLogo>
            ) : ( 
                <>
                    <MenuButtonWrapper isopen={isPopupOpen} onClick={handlePopupToggle}>
                        <span />
                        <span />
                        <span />
                    </MenuButtonWrapper>
                    <PopupContainer isOpen={isPopupOpen}>
                        <PopupContent>
                            <PopupItem ispage={location.pathname === '/' ? 'true' : 'false'} onClick={() => {return history.push("/")}}>
                                Pokedex
                            </PopupItem>
                            <PopupItem ispage={location.pathname === '/favorite' ? 'true' : 'false'} onClick={() => {return history.push("/favorite")}}>
                                Favorite
                            </PopupItem>
                        </PopupContent>
                    </PopupContainer>
                </>
            )}
        </NavBarContainer>
    );
};