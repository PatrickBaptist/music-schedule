import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Logo from '../assets/imgs/logo.webp'
import Button from '../components/Buttons';
import { useNavigate, useLocation } from 'react-router-dom';

const HeaderContainer = styled.div`
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

const ContainerLogo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;

  @media(max-width: 759px) {
        justify-content: space-around;
        padding: 0;
      }

  img {
    width: 140px;
    height: 70px;
    object-fit: cover;
    filter: drop-shadow(2px 3px 5px #949494);
  }
`

interface HeaderProps {
    children: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (location.pathname === '/schedule') {
      navigate('/');
    } else {
      navigate('/schedule');
    }
  };

  return (
    <HeaderContainer>
        <ContainerLogo>
          <img src={Logo} alt="logo da igreja" />
          <Button onClick={handleClick}>{children}</Button>
        </ContainerLogo> 
    </HeaderContainer>
  );
};

export default Header;