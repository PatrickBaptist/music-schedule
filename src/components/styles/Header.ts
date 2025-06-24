import styled from 'styled-components';

export const HeaderContainer = styled.div<{ $openMenu: boolean }>`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  background-color: #000;
  box-shadow: ${({ $openMenu }) => ($openMenu ? 'none' : '0px 0px 5px #000')};
  transition: box-shadow 0.5s ease-in-out;
  position: fixed;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  z-index: 300;
`

export const ContainerLogo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;

  div {
    display: flex;
    gap: 15px;

    .hamburguer {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      cursor: pointer;
      border: none;
    }
      
      .menu {
        width: 25px;
        height: 25px;
      }

      .closeMenu {
        width: 15px;
        height: 15px;
      }

      .hideButton {
        @media (max-width: 550px) {
          display: none;
      }
    }
  }

  .logo {
    width: 140px;
    height: 70px;
    object-fit: cover;
    filter: drop-shadow(2px 3px 5px #949494);
  }

  @media(max-width: 759px) {
    padding: 0 10px;
  }
`