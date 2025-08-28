import styled from 'styled-components';

export const HeaderContainer = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  box-sizing: border-box;
  border-bottom: 1px solid #444;
  background-color: #1a1a1a;
  z-index: 9999;

  @media(max-width: 759px) {
    padding: 0 10px;
  }
`;

export const ContainerLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  .logo {
    width: 90px;
    height: 35px;
    object-fit: contain;
  }
`;

export const NavHeader = styled.nav`
  display: flex;
  align-items: center;
  gap: 25px;

  @media(max-width: 600px) {
    display: none;
  }
`;

export const HeaderItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  a {
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;

    span {
      pointer-events: none;
    }
  }

  div {
    width: 100%;
    height: 2px;
    border-radius: 1px;
    background-color: #2EBEF2;
    margin-top: 2px;
  }

  &:hover span {
    color: #2EBEF2;
  }
`;
