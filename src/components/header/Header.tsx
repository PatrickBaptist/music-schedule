import React from 'react';
import Logo from '../../assets/imgs/logo.png'
import { ContainerLogo, HeaderContainer, HeaderItem, NavHeader } from './HeaderStyle';
import { Link, useLocation } from 'react-router-dom';
import useAuthContext from '../../context/hooks/useAuthContext';
import Logout from '../../assets/imgs/logout.png'
import { motion } from "framer-motion";
import { UserRole } from '../../types/UserRole';

const Header: React.FC = () => {

  const { user, logout } = useAuthContext();
  const location = useLocation();

  const menuItems = [
    { name: "Início", path: "/" },
    { name: "Escala", path: "/schedule" },
    { name: "Canções", path: "/listMusic" },
    { name: "Usuários", path: "/users" },
    { name: "Perfil", path: "/profile" },
  ];

  return (
    <HeaderContainer>
      <ContainerLogo>
        <a href="/"><img src={Logo} alt="Logo da igreja" className="logo" /></a>
      </ContainerLogo>

      <NavHeader>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <HeaderItem key={item.name}>
              <Link to={item.path}>
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    style={{
                      height: 2,
                      background: "#2EBEF2",
                      marginTop: 2,
                      borderRadius: 1,
                      width: '100%',
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </HeaderItem>
          );
        })}
      </NavHeader>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ color: '#fff', fontWeight: 600 }}>Olá, <span style={{ color: '#2EBEF2' }}>{user?.nickname || user?.name}</span></span>
        <motion.button
          onClick={logout}
          title='Sair'
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
          whileHover={{
            scale: [1, 1.2, 1, 1.2, 1],
            rotate: [0, -10, 0, 10, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <img src={Logout} alt="Logout" style={{ width: 28, height: 28 }} />
        </motion.button>
      </div>
    </HeaderContainer>
  );
};

export default Header;