import { Link, useLocation } from "react-router-dom";
import { ContainerFooter, FooterItem, NavFooter } from "./FooterStyle";
import Home from "../../assets/imgs/home.png";
import ScheduleIcon from "../../assets/imgs/agenda.png";
import MusicIcon from "../../assets/imgs/musicas.png";
import Users from "../../assets/imgs/usuarios.png";
import UserIcon from "../../assets/imgs/perfil.png";
import { motion } from "framer-motion";
import useAuthContext from "../../context/hooks/useAuthContext";
import { FaBan } from "react-icons/fa";
import { UserRole } from "../../types/UserRole";

const Footer: React.FC = () => {
  const location = useLocation();

  const { user } = useAuthContext();
  const isGuest = user?.roles?.includes(UserRole.Guest);

  const menuItems = [
    { name: "Início", path: "/", icon: Home },
    { name: "Escala", path: "/schedule", icon: ScheduleIcon },
    { name: "Canções", path: "/listMusic", icon: MusicIcon, blocked: isGuest },
    { name: "usuários", path: "/users", icon: Users, blocked: isGuest },
    { name: "eu", path: "/profile", icon: UserIcon },
  ];

  return (
    <ContainerFooter>
      <NavFooter>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <FooterItem key={item.name} $active={isActive}>
              {item.blocked ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    opacity: 0.5,
                    cursor: "not-allowed",
                    position: "relative",
                  }}
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    style={{
                      width: 30,
                      height: 30,
                      marginBottom: 2,
                      filter: "grayscale(100%)",
                    }}
                  />
                  <FaBan
                    size={12}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: -4,
                      color: "red",
                    }}
                  />

                  <span style={{ color: "#aaa" }}>{item.name}</span>
                </div>
              ) : (
                <Link to={item.path}>
                  <motion.img
                    src={item.icon}
                    alt={item.name}
                    animate={{
                      y: isActive ? -4 : 0,
                      scale: 1,
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
              )}
            </FooterItem>
          );
        })}
      </NavFooter>
    </ContainerFooter>
  );
};

export default Footer;
