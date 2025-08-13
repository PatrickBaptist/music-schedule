import styled from 'styled-components';

export const HeaderContainer = styled.div<{ $openMenu: boolean }>`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  transition: box-shadow 0.5s ease-in-out;
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  z-index: 100900;
  border: none; /* eliminar bordas */
  box-shadow: none; /* eliminar sombra que cause linha */
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
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      cursor: pointer;
      border: none;
    }
      
      .menu {
        width: 20px;
        height: 20px;
      }

      .closeMenu {
        width: 12px;
        height: 12px;
      }
  }

  .logo {
    width: 90px;
    height: 35px;
    object-fit: contain;
  }

  @media(max-width: 759px) {
    padding: 0 10px;
  }
`