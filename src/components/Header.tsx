import React, { ReactNode } from 'react';
import Logo from '../assets/imgs/logo.webp'
import { ContainerLogo, HeaderContainer } from './styles/Header';
import Menu from '../assets/imgs/Menu.png';
import ClosedMenu from '../assets/imgs/closeMenu.png'
import { useUserContext } from '../context/hooks/useUserContext';

interface HeaderProps {
    children: ReactNode;
}

const Header: React.FC<HeaderProps> = () => {

  const { openMenu, setOpenMenu } = useUserContext();

  const handleMenuClick = () => {
    setOpenMenu(!openMenu);
  }

  return (
    <HeaderContainer $openMenu={openMenu}>
        <ContainerLogo>
          <a href="/"><img src={Logo} alt="logo da igreja" className='logo'/></a>
          <div>
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