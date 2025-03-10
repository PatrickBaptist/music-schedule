import styled from "styled-components";

export const ContainerMenu = styled.div<{ $openMenu: boolean }>`
    width: 100vw;
    position: fixed;
    z-index: 200;
    box-shadow: 0px 5px 5px -5px #fff;
    margin-top: 80px;
    transition: transform 0.5s ease-in-out, opacity 1s ease-in-out;
    transform: ${({ $openMenu }) => ($openMenu ? 'translateY(0)' : 'translateY(-200%)')};
    pointer-events: ${({ $openMenu }) => ($openMenu ? 'auto' : 'none')};
`

export const ContentMenu = styled.div`
    width: 100%;
    height: 100%;
    background-color: #000;
    z-index: 250;
`

export const NavMenu = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;

    ul {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        list-style-type: none;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        
        li {
            font-weight: bold;
            margin: 10px 0 40px 0;
            cursor: pointer;
            transition: transform 2s;

            &:hover {
                color: white;
            }
        }
    }
`