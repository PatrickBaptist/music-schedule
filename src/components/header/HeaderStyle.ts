import styled from 'styled-components';

export const HeaderContainer = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-page-bg);
  z-index: 9999;

  @media(max-width: 759px) {
    padding: 0 10px;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media(max-width: 520px) {
    gap: 8px;
  }
`;

export const ProfileButton = styled.button`
  position: relative;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  padding: 0;
  overflow: visible;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-weight: 800;
  font-size: 0.88rem;
`;

export const ProfileAvatarFrame = styled.span`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(46, 190, 242, 0.18), rgba(15, 142, 196, 0.28));
  border: 2px solid var(--color-primary);
  box-shadow: 0 4px 14px rgba(15, 142, 196, 0.18);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ProfileBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 2px solid var(--color-page-bg);
  background: #ff7f50;
  box-shadow: 0 0 0 2px rgba(255, 127, 80, 0.25);
  z-index: 2;
`;

export const ThemeSwitcher = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);

  button {
    width: 30px;
    height: 28px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--color-text-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  button:hover,
  button.active {
    background: var(--color-surface-muted);
    color: var(--color-primary);
  }

  @media(max-width: 420px) {
    button {
      width: 27px;
      height: 26px;
    }
  }
`;

export const ContainerLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  .logo {
    width: 90px;
    height: 50px;
  }
`;

export const NavHeader = styled.nav`
  display: flex;
  align-items: center;
  gap: 25px;

  @media(max-width: 670px) {
    display: none;
  }
`;

export const HeaderItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  a {
    color: var(--color-text-strong);
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
    background-color: var(--color-primary);
    margin-top: 2px;
  }

  &:hover span {
    color: var(--color-primary);
  }
`;
