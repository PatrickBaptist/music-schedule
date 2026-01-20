import { Link, useLocation } from "react-router-dom";
import { ContainerFooter, FooterItem, NavFooter } from "./FooterStyle";
import Home from '../../assets/imgs/home.png';
import ScheduleIcon from '../../assets/imgs/agenda.png';
import MusicIcon from '../../assets/imgs/musicas.png';
import Gerenciador from '../../assets/imgs/gerenciador.png';
import Users from '../../assets/imgs/usuarios.png';
import UserIcon from '../../assets/imgs/perfil.png';
import { motion } from "framer-motion";
import { UserRole } from "../../types/UserRole";
import useAuthContext from "../../context/hooks/useAuthContext";

const Footer: React.FC = () => {
  const location = useLocation();
  const user = useAuthContext();
  const isLeader = user.user?.roles?.includes(UserRole.Leader || UserRole.Admin);

  const menuItems = [
    { name: "Início", path: "/", icon: Home },
    { name: "Escala", path: "/schedule", icon: ScheduleIcon },
    { name: "Canções", path: "/listMusic", icon: MusicIcon },
    ...(isLeader ? [{ name: "gerenc.", path: "/alter", icon: Gerenciador }] : []),
    { name: "usuários", path: "/users", icon: Users },
    { name: "eu", path: "/profile", icon: UserIcon },
  ];

  return (
    <ContainerFooter>
      <NavFooter>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <FooterItem key={item.name} $active={isActive}>
              <Link to={item.path}>
                <motion.img
                  src={item.icon}
                  alt={item.name}
                  whileHover={{
                    y: -5,
                    scale: 1.15,
                  }}
                  animate={{
                    y: isActive ? -4 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  style={{ width: 30, height: 30, marginBottom: 2 }}
                />
                <span>{item.name}</span>
              </Link>
            </FooterItem>
          );
        })}
      </NavFooter>
    </ContainerFooter>
  );
};

export default Footer;