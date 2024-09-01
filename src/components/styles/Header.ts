import styled from 'styled-components';

export const HeaderContainer = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  background-color: #7fc3ff;
  box-shadow: 0px 0px 5px #000;
  position: fixed;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  z-index: 3;
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
  }

  img {
    width: 140px;
    height: 70px;
    object-fit: cover;
    filter: drop-shadow(2px 3px 5px #949494);
  }

  @media(max-width: 759px) {
    padding: 0 10px;
  }
`