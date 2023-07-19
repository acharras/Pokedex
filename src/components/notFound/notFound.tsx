import { useHistory } from "react-router";
import styled, { keyframes } from 'styled-components';

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

const NotFoundContainer = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 100vw;
    justify-content: center;
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
                ${shake} 1.25s cubic-bezier(.36,.07,.19,.97) 3;

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
    animation: ${blink} .5s alternate 7;
`;
  

export function NotFound() {

    let history = useHistory();

    return (
        <NotFoundContainer>
            <Loading  onClick={ () => { return history.push("/") }}><Pokeball><PokeballBefore /><PokeballAfter /><PokeballButton /></Pokeball></Loading>
        </NotFoundContainer>
    )
}