import { Link, useLocation } from "react-router-dom";
import { ContainerFooter, FooterItem, NavFooter } from "./FooterStyle";
import Home from '../../assets/imgs/home.png';
import ScheduleIcon from '../../assets/imgs/agenda.png';
import MusicIcon from '../../assets/imgs/musicas.png';
import Gerenciador from '../../assets/imgs/gerenciador.png';
import Users from '../../assets/imgs/usuarios.png';
import UserIcon from '../../assets/imgs/perfil.png';
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Início", path: "/", icon: Home },
    { name: "Escala", path: "/schedule", icon: ScheduleIcon },
    { name: "Canções", path: "/listMusic", icon: MusicIcon },
    { name: "gerenc.", path: "/alter", icon: Gerenciador },
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
                  initial={{ y: 0 }}
                  whileHover={{
                    y: [-2, -5, -2], // leve sobe e desce
                    scale: [1, 1.2, 1], // aumenta e volta ao normal
                  }}
                  animate={isActive ? { y: [0, -5, 0] } : { y: 0 }}
                  transition={isActive ? { duration: 0.6, repeat: Infinity, repeatType: "loop" } : { duration: 0 }}
                  style={{ width: 20, height: 20, marginBottom: 2 }}
                />
                <span>{item.name}</span>
              </Link>
            </FooterItem>
          );
        })}
      </NavFooter>
      <h5>© direitos reservados</h5>
    </ContainerFooter>
  );
};

export default Footer;