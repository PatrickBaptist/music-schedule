import styled from 'styled-components'

export const ContainerFooter = styled.footer`
  width: 100%;
  height: 90px;
  padding: 10px 0 25px 0;
  text-align: center;
  background-color: var(--color-page-bg);
  border-top: 1px solid var(--color-border);
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
    position: relative;
    text-decoration: none;
    color: ${(props) =>
      props.$active ? "var(--color-primary)" : "var(--color-text-muted)"};
    font-weight: ${(props) => (props.$active ? "600" : "400")};
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

export const FooterBadge = styled.span`
  position: absolute;
  top: -4px;
  right: 4px;
  width: 11px;
  height: 11px;
  border: 2px solid var(--color-page-bg);
  border-radius: 50%;
  background: #ff7f50;
  box-shadow: 0 0 0 2px rgba(255, 127, 80, 0.22);
`;
