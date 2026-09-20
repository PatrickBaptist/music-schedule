import React, { useMemo } from 'react';
import Logo from '../../assets/imgs/logo.png'
import {
  ContainerLogo,
  HeaderActions,
  HeaderContainer,
  HeaderItem,
  NavBadge,
  ProfileAvatarFrame,
  ProfileBadge,
  ProfileButton,
  NavHeader,
  ThemeSwitcher,
} from './HeaderStyle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthContext from '../../context/hooks/useAuthContext';
import { motion } from "framer-motion";
import { UserRole } from '../../types/UserRole';
import { FaDesktop, FaMoon, FaSun } from 'react-icons/fa';
import useThemePreference from '../../context/hooks/useThemePreference';
import { getPendingProfileFields } from '../../helpers/profileCompletion';
import Button from '../buttons/Buttons';
import useMyScheduleContext from '../../context/hooks/useMyScheduleContext';

const Header: React.FC = () => {

  const { user } = useAuthContext();
  const { mode, setMode } = useThemePreference();
  const location = useLocation();
  const navigate = useNavigate();
  const { hasUnseenAssignments } = useMyScheduleContext();
  
  const isGuest = user?.roles?.includes(UserRole.Guest);
  const pendingProfileFields = useMemo(() => getPendingProfileFields(user), [user]);
  const shouldShowBadge = !isGuest && pendingProfileFields.length > 0;
  const profileLabel = useMemo(() => {
    const sourceName = user?.nickname || user?.name || user?.email || "";
    return sourceName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";
  }, [user?.email, user?.name, user?.nickname]);

  const menuItems = [
    { name: "Início", path: "/" },
    { name: "Escala", path: "/schedule" },
    { name: "Canções", path: "/listMusic", blocked: isGuest },
    { name: "Usuários", path: "/users", blocked: isGuest },
    { name: "Agenda", path: "/my-schedule" },
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
                  {item.path === "/my-schedule" && hasUnseenAssignments && (
                    <NavBadge title="Você tem uma escala nova" aria-label="Você tem uma escala nova" />
                  )}
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
          <Button
            variant="unstyled"
            className={mode === "light" ? "active" : ""}
            title="Modo claro"
            aria-label="Modo claro"
            onClick={() => setMode("light")}
          >
            <FaSun size={14} />
          </Button>
          <Button
            variant="unstyled"
            className={mode === "dark" ? "active" : ""}
            title="Modo escuro"
            aria-label="Modo escuro"
            onClick={() => setMode("dark")}
          >
            <FaMoon size={14} />
          </Button>
          <Button
            variant="unstyled"
            className={mode === "system" ? "active" : ""}
            title="Tema do sistema"
            aria-label="Tema do sistema"
            onClick={() => setMode("system")}
          >
            <FaDesktop size={14} />
          </Button>
        </ThemeSwitcher>
        <ProfileButton
          type="button"
          title="Abrir perfil"
          aria-label="Abrir perfil"
          onClick={() => navigate("/profile", { state: shouldShowBadge ? { openCompletion: true } : undefined })}
        >
          <ProfileAvatarFrame>
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.name || "Foto do usuario"} />
            ) : (
              <span>{profileLabel}</span>
            )}
          </ProfileAvatarFrame>
          {shouldShowBadge && <ProfileBadge aria-hidden="true" />}
        </ProfileButton>
        {!isGuest && (
          <span style={{ color: 'var(--color-text-strong)', fontWeight: 600 }}>
            Olá, <span style={{ color: 'var(--color-primary)' }}>
              {user?.nickname || user?.name}
            </span>
          </span>
        )}
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header;
