import React, { useMemo } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageWrapper from "../../components/pageWrapper/pageWrapper";
import useUsersContext from "../../context/hooks/useUsersContext";
import { roleOptions, UserRole } from "../../types/UserRole";
import { ScrollContainer, UserCard, UsersContainer } from "./usersStyle";
import { toast } from "sonner";
import { FaUser, FaCogs, FaCheckCircle, FaTimesCircle, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const UsersCardsPage: React.FC = () => {
  const { users, updateUser, fetchUsers } = useUsersContext();

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
    return roleOptions.find((r) => r.value === role)?.label || role;
  };

  const processedUsers = useMemo(() => {
    const usersWithSortedRoles = users
      .map((user) => {
        const validRoles = user.roles
          .filter((r) => r !== UserRole.Admin && r !== UserRole.Guest)
          .sort(
            (a, b) =>
              rolePriority.indexOf(a as UserRole) -
              rolePriority.indexOf(b as UserRole)
          );
        return { ...user, roles: validRoles };
      })
      .filter((user) => user.roles.length > 0);

    usersWithSortedRoles.sort((a, b) => {
      const aPriority = rolePriority.findIndex((r) => a.roles.includes(r));
      const bPriority = rolePriority.findIndex((r) => b.roles.includes(r));
      if (aPriority === bPriority) {
        return (a.nickname || a.name).localeCompare(b.nickname || b.name);
      }
      return aPriority - bPriority;
    });

    return usersWithSortedRoles;
  }, [users, rolePriority]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "enabled":
        return "Ativo";
      case "pending":
        return "Pendente";
      case "disabled":
        return "Desativado";
      default:
        return status;
    }
  };

  const handleStatusChange = async (id: string, status: "enabled" | "disabled") => {
    const toastId = toast.loading("Aguarde...");
    try {
      await updateUser(id, { status });
      await fetchUsers();
      toast.success("Status alterado com sucesso!", { id: toastId });
    } catch (err) {
      if (err instanceof Error) {
        toast.error("Sem premissão! " + err.message, { id: toastId });
      } else {
        toast.error("Erro desconhecido ao salvar", { id: toastId });
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Header />
      <ScrollContainer>
        <PageWrapper>
          <h1>Usuários</h1>
          <UsersContainer>
            {processedUsers.map((user, index) => (
              <UserCard
                key={user.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
              >
                <span><FaUser style={{ marginRight: '8px' }} /> <strong>{user.nickname || user.name}</strong></span>
                <span><FaCogs style={{ marginRight: '8px' }} /> {user.roles.map((r) => getRoleLabel(r as UserRole)).join(", ")}</span>
                <span>
                  {user.status === "enabled" ? <FaCheckCircle style={{ color: 'green', marginRight: '8px' }} /> : <FaTimesCircle style={{ color: 'red', marginRight: '8px' }} />}
                  Status: {getStatusLabel(user.status!)}
                </span>

                {user.status !== "enabled" && (
                  <button onClick={() => handleStatusChange(user.id, "enabled")}>
                    <FaToggleOn style={{ marginRight: '6px' }} /> Ativar
                  </button>
                )}

                {user.status !== "disabled" && (
                  <button onClick={() => handleStatusChange(user.id, "disabled")}>
                    <FaToggleOff style={{ marginRight: '6px' }} /> Desativar
                  </button>
                )}
              </UserCard>
            ))}
          </UsersContainer>
        </PageWrapper>
      </ScrollContainer>
      <Footer />
    </div>
  );
};

export default UsersCardsPage;
