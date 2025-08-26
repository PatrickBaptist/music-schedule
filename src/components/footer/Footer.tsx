import { Link, useLocation } from "react-router-dom";
import { ContainerFooter, FooterItem, NavFooter } from "./FooterStyle";
import Home from '../../assets/imgs/home.png';
import ScheduleIcon from '../../assets/imgs/agenda.png';
import MusicIcon from '../../assets/imgs/musicas.png';
import Gerenciador from '../../assets/imgs/gerenciador.png';
import Users from '../../assets/imgs/usuarios.png';
import UserIcon from '../../assets/imgs/perfil.png';

const Footer: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Início", path: "/", icon: Home },
    { name: "Escala", path: "/schedule", icon: ScheduleIcon },
    { name: "Canções", path: "/listMusic", icon: MusicIcon },
    { name: "gerenc.", path: "/alter", icon: Gerenciador },
    { name: "usuários", path: "/profiles", icon: Users },
    { name: "eu", path: "/profile", icon: UserIcon },
  ];

  return (
    <ContainerFooter>
      <NavFooter>
        {menuItems.map((item) => (
          <FooterItem key={item.name} $active={location.pathname === item.path}>
            <Link to={item.path}>
              <img src={item.icon} alt={item.name} />
              <span>{item.name}</span>
            </Link>
          </FooterItem>
        ))}
      </NavFooter>
      <h5>© direitos reservados</h5>
    </ContainerFooter>
  );
};

export default Footer;