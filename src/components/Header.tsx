import React, { ReactNode } from 'react';
import Logo from '../assets/imgs/logo.webp'
import Button from '../components/Buttons';
import { useNavigate, useLocation } from 'react-router-dom';
import { ContainerLogo, HeaderContainer } from './styles/Header';

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

  const handleClicklist = () => {
    navigate('/listMusic')
  };

  return (
    <HeaderContainer>
        <ContainerLogo>
          <a href="/"><img src={Logo} alt="logo da igreja" /></a>
          <div>
          <Button onClick={handleClick}>{children}</Button>
          <Button onClick={handleClicklist}>Sugest. Music</Button>
          </div>
        </ContainerLogo> 
    </HeaderContainer>
  );
};

export default Header;