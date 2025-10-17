import React, { useEffect, useMemo, useState } from "react";
import PageWrapper from "../../components/pageWrapper/pageWrapper";
import useUsersContext from "../../context/hooks/useUsersContext";
import { roleOptions, UserRole } from "../../types/UserRole";
import { UserCard, UsersContainer } from "./usersStyle";
import { toast } from "sonner";
import { FaUser, FaCogs, FaCheckCircle, FaTimesCircle, FaToggleOn, FaToggleOff, FaEnvelope, FaTrash } from 'react-icons/fa';
import LoadingScreen from "../../components/loading/LoadingScreen";
import { Timestamp } from "firebase/firestore";

const UsersCardsPage: React.FC = () => {
  const { users, updateUser, fetchUsers, deleteUser, listenUserStatus } = useUsersContext();
  const [isLoading, setIsLoading] = useState(true);
  const [userStatuses, setUserStatuses] = useState<Record<string, { isOnline?: boolean; lastSeen?: string }>>({});

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchUsers();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchUsers]);

  useEffect(() => {
    const unsubscribers = users.map((user) =>
      listenUserStatus(user.id, (data) => {
        setUserStatuses((prev) => ({
          ...prev,
          [user.id]: {
            isOnline: data.isOnline,
            lastSeen: data.lastSeen,
          },
        }));
      })
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub && unsub());
    };
  }, [users, listenUserStatus]);

  const getLastSeenLabel = (timestamp?: string | Timestamp) => {
    if (!timestamp) return "nunca 😡";
    
    let date: Date;

    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }

    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "agora mesmo";
    if (minutes < 60) return `há ${minutes} min`;
    if (hours < 24) return `há ${hours}h`;
    return `há ${days} dia${days > 1 ? "s" : ""}`;

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

  const handleDelete = async (id: string, userName: string) => {
    toast(
      `Deseja realmente deletar o usuário "${userName}"?`,
      {
        action: {
          label: "Deletar",
          onClick: async () => {
            const toastId = toast.loading("Aguarde...");
            try {
              await deleteUser(id);
              await fetchUsers();
              toast.success("Usuário deletado com sucesso!", { id: toastId });
            } catch (err) {
              if (err instanceof Error) {
                toast.error("Sem premissão! " + err.message, { id: toastId });
              } else {
                toast.error("Erro desconhecido ao deletar", { id: toastId });
              }
            }
          },
        },
      }
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: "40px 0",
      }}
    >
      <PageWrapper>
        <h1>Usuários</h1>
        {isLoading ? (
          <LoadingScreen /> 
        ) : (
            <UsersContainer>
              {processedUsers.map((user, index) => (
                <UserCard
                  key={user.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><FaUser style={{ marginRight: '8px' }} />
                  <strong>{user.nickname || user.name}</strong>
                  {userStatuses[user.id]?.isOnline ? (
                    <span style={{ color: "green", fontWeight: 500, fontSize: '0.85rem' }}>🟢 Online</span>
                  ) : (
                    <span style={{ color: "gray", fontWeight: 500, fontSize: '0.85rem'}}>
                      ⚪ Visto {getLastSeenLabel(userStatuses[user.id]?.lastSeen)}
                    </span>
                  )}
                  </span>
                  <span><FaEnvelope style={{ marginRight: '8px' }} />{user.email}</span>
                  <span><FaCogs style={{ marginRight: '8px' }} /> {user.roles.map((r) => getRoleLabel(r as UserRole)).join(", ")}</span>
                  <span>
                    {user.status === "enabled" ? <FaCheckCircle style={{ color: 'green', marginRight: '8px' }} /> : <FaTimesCircle style={{ color: 'red', marginRight: '8px' }} />}
                    Status: {getStatusLabel(user.status!)}
                  </span>


                  <div className="actions-container">
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
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user.id, user.nickname || user.name)}
                    >
                      <FaTrash style={{ marginRight: '6px' }} /> Deletar
                    </button>
                  </div>
                </UserCard>
              ))}
            </UsersContainer>
        )}
      </PageWrapper>
    </div>
  );
};

export default UsersCardsPage;
