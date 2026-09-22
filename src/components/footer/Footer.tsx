import { Link, useLocation } from "react-router-dom";
import { ContainerFooter, FooterBadge, FooterItem, NavFooter } from "./FooterStyle";
import { motion } from "framer-motion";
import useAuthContext from "../../context/hooks/useAuthContext";
import { FaBan, FaCalendarAlt, FaClipboardList, FaHome, FaMusic, FaUsers } from "react-icons/fa";
import { UserRole } from "../../types/UserRole";
import useMyScheduleContext from "../../context/hooks/useMyScheduleContext";

const Footer: React.FC = () => {
  const location = useLocation();

  const { user } = useAuthContext();
  const { hasUnseenAssignments } = useMyScheduleContext();
  const isGuest = user?.roles?.includes(UserRole.Guest);

  const menuItems = [
    { name: "Início", path: "/", icon: FaHome },
    { name: "Escala", path: "/schedule", icon: FaClipboardList },
    { name: "Canções", path: "/listMusic", icon: FaMusic, blocked: isGuest },
    { name: "Usuários", path: "/users", icon: FaUsers, blocked: isGuest },
    { name: "Agenda", path: "/my-schedule", icon: FaCalendarAlt },
  ];

  return (
    <ContainerFooter>
      <NavFooter>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <FooterItem key={item.name} $active={isActive}>
              {item.blocked ? (
                <div className="blocked-item" aria-disabled="true">
                  <span className="footer-icon">
                    <Icon aria-hidden="true" />
                    <FaBan className="blocked-icon" aria-hidden="true" />
                  </span>
                  <span>{item.name}</span>
                </div>
              ) : (
                <Link to={item.path}>
                  <motion.span
                    className="footer-icon"
                    animate={{
                      y: isActive ? -3 : 0,
                      scale: isActive ? 1.05 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <Icon aria-hidden="true" />
                    {item.path === "/my-schedule" && hasUnseenAssignments && (
                      <FooterBadge title="Você tem uma escala nova" aria-label="Você tem uma escala nova" />
                    )}
                  </motion.span>
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
