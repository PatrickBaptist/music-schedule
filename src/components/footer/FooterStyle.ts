import styled from 'styled-components'

export const ContainerFooter = styled.footer`
  width: 100%;
  height: 50px;
  padding: 10px 0 25px 0;
  text-align: center;
  background-color: #000;
  border-top: 1px solid #444;
  z-index: 9999;
  position: fixed;
  bottom: 0;
  left: 0;
`;

export const NavFooter = styled.nav`
  display: flex;
  justify-content: space-around;
  margin-bottom: 5px;

  @media (min-width: 671px) {
      display: none;
  }
`;

export const FooterItem = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  a {
    text-decoration: none;
    color: ${(props) => (props.$active ? "#2f81f7" : "#555")};
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  img {
    width: 20px;
    height: 20px;
    margin-bottom: 2px;
  }
`;
