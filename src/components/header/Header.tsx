import React from 'react';
import Logo from '../../assets/imgs/logo.png'
import {
  ContainerLogo,
  HeaderActions,
  HeaderContainer,
  HeaderItem,
  NavHeader,
  ThemeSwitcher,
} from './HeaderStyle';
import { Link, useLocation } from 'react-router-dom';
import useAuthContext from '../../context/hooks/useAuthContext';
import Logout from '../../assets/imgs/logout.png'
import { motion } from "framer-motion";
import { UserRole } from '../../types/UserRole';
import { FaDesktop, FaMoon, FaSun } from 'react-icons/fa';
import useThemePreference from '../../context/hooks/useThemePreference';

const Header: React.FC = () => {

  const { user, logout } = useAuthContext();
  const { mode, setMode } = useThemePreference();
  const location = useLocation();
  
  const isGuest = user?.roles?.includes(UserRole.Guest);

  const menuItems = [
    { name: "Início", path: "/" },
    { name: "Escala", path: "/schedule" },
    { name: "Canções", path: "/listMusic", blocked: isGuest },
    { name: "Usuários", path: "/users", blocked: isGuest },
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
              {item.blocked ? (
                <span style={{ opacity: 0.5, cursor: "not-allowed" }}>
                  {item.name} 🔒
                </span>
              ) : (
                <Link to={item.path}>
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      style={{
                        height: 2,
                        background: "var(--color-primary)",
                        marginTop: 2,
                        borderRadius: 1,
                        width: '100%',
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )}
            </HeaderItem>
          );
        })}
      </NavHeader>

      <HeaderActions>
        <ThemeSwitcher aria-label="Escolher tema">
          <button
            type="button"
            className={mode === "light" ? "active" : ""}
            title="Modo claro"
            aria-label="Modo claro"
            onClick={() => setMode("light")}
          >
            <FaSun size={14} />
          </button>
          <button
            type="button"
            className={mode === "dark" ? "active" : ""}
            title="Modo escuro"
            aria-label="Modo escuro"
            onClick={() => setMode("dark")}
          >
            <FaMoon size={14} />
          </button>
          <button
            type="button"
            className={mode === "system" ? "active" : ""}
            title="Tema do sistema"
            aria-label="Tema do sistema"
            onClick={() => setMode("system")}
          >
            <FaDesktop size={14} />
          </button>
        </ThemeSwitcher>
        {!isGuest && (
          <span style={{ color: 'var(--color-text-strong)', fontWeight: 600 }}>
            Olá, <span style={{ color: 'var(--color-primary)' }}>
              {user?.nickname || user?.name}
            </span>
          </span>
        )}
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
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header;
