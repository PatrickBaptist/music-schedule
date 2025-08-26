import styled from 'styled-components';

export const HeaderContainer = styled.div<{ $openMenu: boolean }>`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  transition: box-shadow 0.5s ease-in-out;
  background-color: transparent;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  z-index: 100900;
  border-bottom: 1px solid #444;
  box-shadow: none;
  z-index: 9999;

  @media (max-width: 600px) {
    background-color: none;
  }
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
    align-items: center;
    gap: 15px;

    span {
      color: #fff;
      font-size: 14px;
      font-weight: 400;
    }

    p {
      font-size: 18px;
      font-weight: 500;
    }

    .logout {
      width: 30px;
      cursor: pointer;
      object-fit: contain;
      filter: drop-shadow(3px 3px 5px white);

      &:hover {
        filter: drop-shadow(3px 3px 5px red);
      }
    }

    .hamburguer {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      cursor: pointer;
      border: none;

      @media (max-width: 600px) {
        display: none;
      }
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