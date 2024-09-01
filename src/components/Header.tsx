import React, { ReactNode } from 'react';
import Logo from '../assets/imgs/logo.webp'
import Button from '../components/Buttons';
import { useNavigate, useLocation } from 'react-router-dom';
import { ContainerLogo, HeaderContainer } from './styles/Header';
import Menu from '../assets/imgs/Menu.png';
import ClosedMenu from '../assets/imgs/closeMenu.png'
import { useUserContext } from '../context/hooks/useUserContext';

interface HeaderProps {
    children: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {

  const { openMenu, setOpenMenu } = useUserContext();
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

  const handleMenuClick = () => {
    setOpenMenu(!openMenu);
  }

  return (
    <HeaderContainer>
        <ContainerLogo>
          <a href="/"><img src={Logo} alt="logo da igreja" className='logo'/></a>
          <div>
            <Button onClick={handleClick} className='hideButton'>{children}</Button>
            <Button onClick={handleClicklist} className='hideButton'>Sugest. Music</Button>
            <button onClick={handleMenuClick} className='hamburguer'>
              <img 
                  src={openMenu ? ClosedMenu : Menu} 
                  alt="Hamburguer" 
                  className={openMenu ? 'closeMenu' : 'menu'}
              />            
            </button>
          </div>
        </ContainerLogo> 
    </HeaderContainer>
  );
};

export default Header;