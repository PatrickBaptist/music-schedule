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
  align-items: flex-start;
  justify-content: space-around;
  gap: 2px;
  margin-bottom: 5px;

  @media (min-width: 671px) {
      display: none;
  }
`;

export const FooterItem = styled.div<{ $active?: boolean }>`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  a,
  .blocked-item {
    position: relative;
    width: 100%;
    text-decoration: none;
    color: ${(props) =>
      props.$active ? "var(--color-primary)" : "var(--color-text-muted)"};
    font-weight: ${(props) => (props.$active ? "600" : "400")};
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .footer-icon {
    position: relative;
    width: 38px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: ${(props) => props.$active
      ? "color-mix(in srgb, var(--color-primary) 14%, transparent)"
      : "transparent"};
    transition: background-color 0.2s ease, color 0.2s ease;

    > svg {
      width: 21px;
      height: 21px;
    }
  }

  .blocked-item {
    color: var(--color-text-muted);
    cursor: not-allowed;
    opacity: 0.45;
  }

  .blocked-icon {
    position: absolute;
    top: 1px;
    right: 1px;
    width: 10px !important;
    height: 10px !important;
    color: #dc2626;
  }

  @media (max-width: 370px) {
    a,
    .blocked-item {
      font-size: 11px;
    }

    .footer-icon {
      width: 34px;
    }
  }
`;

export const FooterBadge = styled.span`
  position: absolute;
  top: 1px;
  right: 2px;
  width: 11px;
  height: 11px;
  border: 2px solid var(--color-page-bg);
  border-radius: 50%;
  background: #ff7f50;
  box-shadow: 0 0 0 2px rgba(255, 127, 80, 0.22);
`;
