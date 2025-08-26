import React from 'react';
import Logo from '../../assets/imgs/logo.webp'
import { ContainerLogo, HeaderContainer } from './HeaderStyle';
import Menu from '../../assets/imgs/Menu.png';
import ClosedMenu from '../../assets/imgs/closeMenu.png'
import Logout from '../../assets/imgs/logout.png'
import useUserContext from '../../context/hooks/useUserContext';
import useAuthContext from '../../context/hooks/useAuthContext';

const Header: React.FC = () => {

  const { openMenu, setOpenMenu } = useUserContext();
  const { user } = useAuthContext();
  const { logout } = useAuthContext();

  const handleMenuClick = () => {
    setOpenMenu(!openMenu);
  }

  return (
    <HeaderContainer $openMenu={openMenu}>
        <ContainerLogo>
          <a href="/"><img src={Logo} alt="logo da igreja" className='logo'/></a>
          <div>
            <p><span>Olá,</span> {user?.nickname || user?.name}</p>
            <button style={{background: 'transparent', border: 'none', paddingRight: '20px'}} onClick={logout}>
              <img 
                  src={Logout}
                  alt="Logout Icon"
                  className= 'logout'
                  />    
            </button>
            <button onClick={handleMenuClick} className='hamburguer' aria-label="Menu">
              <img 
                  src={openMenu ? ClosedMenu : Menu}
                  alt="Menu Icon" 
                  className={openMenu ? 'closeMenu' : 'menu'}
              />           
            </button>
          </div>
        </ContainerLogo>
    </HeaderContainer>
  );
};

export default Header;