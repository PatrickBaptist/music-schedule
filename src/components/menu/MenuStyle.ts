import styled from 'styled-components';

export const ContainerMenu = styled.div<{ $openMenu: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 170px;
  z-index: 2025;
  max-height: ${({ $openMenu }) => ($openMenu ? '300px' : '0')};
  overflow: hidden;
  transition: max-height 0.4s ease;
  background-color: rgba(0, 0, 0, 0.7);
  margin: 0;
  padding-top: 60px;
  border: none;

  @media (max-width: 600px) {
    display: none;
  }

  @media (min-width: 550px) {
    height: 60px;
  }
`;

export const ContentMenu = styled.div`
  width: 100%;
`;

export const NavMenu = styled.nav`
  width: 100%;

  ul {
    list-style: none;
    margin: 0;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    gap: 30px;

    @media (max-width: 550px) {
      flex-direction: column;
      gap: 15px;
      align-items: center;
    }

    li {
      color: #00bfff;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 5px;
      transition: background-color 0.3s ease, color 0.3s ease;

      &:hover {
        background-color: #00bfff;
        color: #000;
      }
    }
  }
`;
