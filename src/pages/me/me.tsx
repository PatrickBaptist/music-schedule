import React, { useEffect, useMemo, useState } from 'react';
import PageWrapper from '../../components/pageWrapper/pageWrapper';
import { Badge, ProfileItem, ProfileList, ProfileTitle } from './meStyle';
import useAuthContext from '../../context/hooks/useAuthContext';
import { roleOptions, UserRole } from '../../types/UserRole';
import { FaCogs, FaEnvelope, FaTag, FaUser } from 'react-icons/fa';
import LoadingScreen from '../../components/loading/LoadingScreen';

const MePage: React.FC = () => {
  const { user } = useAuthContext();
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    setIsLoading(!user);
  }, [user]);

  const rolePriority = useMemo(() => [
    UserRole.Leader,
    UserRole.Minister,
    UserRole.Vocal,
    UserRole.Keyboard,
    UserRole.Violao,
    UserRole.Guitar,
    UserRole.Bass,
    UserRole.Drums,
    UserRole.Sound,
    UserRole.Midia,
    UserRole.DataShow,
  ], []);

  const getRoleLabel = (role: UserRole) => {
    return roleOptions.find(r => r.value === role)?.label || role;
  };

  const userRoles = useMemo(() => {
    if (!user?.roles) return '';
    return user.roles
      .filter(r => r !== UserRole.Admin)
      .sort((a, b) => rolePriority.indexOf(a as UserRole) - rolePriority.indexOf(b as UserRole))
      .map(r => getRoleLabel(r as UserRole))
      .join(', ');
  }, [user?.roles, rolePriority]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center", justifyContent: "center" }}
    >
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <PageWrapper>
          <ProfileTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Meu Perfil
          </ProfileTitle>

          {user && (
            <ProfileList>
              <ProfileItem
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <FaUser style={{ marginRight: "8px", color: "#1e90ff" }} />
                <strong>Nome:</strong> {user.name}
              </ProfileItem>

              <ProfileItem
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FaTag style={{ marginRight: "8px", color: "#ff7f50" }} />
                <strong>Apelido:</strong> {user.nickname}
              </ProfileItem>

              <ProfileItem
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FaEnvelope style={{ marginRight: "8px", color: "#32cd32" }} />
                <strong>Email:</strong> {user.email}
              </ProfileItem>

              <ProfileItem
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FaCogs style={{ marginRight: "8px", color: "#ffa500" }} />
                <strong>Funções:</strong>
                {userRoles?.split(", ").map((role, i) => (
                  <Badge key={i}>{role}</Badge>
                ))}
              </ProfileItem>
            </ProfileList>
          )}
        </PageWrapper>
      )}
    </div>
  );
};

export default MePage;