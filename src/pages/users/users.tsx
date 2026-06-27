import React, { useCallback, useEffect, useMemo, useState } from "react";
import PageWrapper from "../../components/pageWrapper/pageWrapper";
import useUsersContext from "../../context/hooks/useUsersContext";
import { roleOptions, UserRole } from "../../types/UserRole";
import {
  AuditLink,
  CardActionButton,
  CloseButton,
  DangerActionButton,
  FieldLabel,
  FormGroup,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PageTopBar,
  PrimaryActionButton,
  RoleChip,
  RoleGrid,
  SelectField,
  TextInput,
  UserCard,
  UsersContainer,
} from "./usersStyle";
import { toast } from "sonner";
import {
  FaUser,
  FaCogs,
  FaCheckCircle,
  FaTimesCircle,
  FaToggleOn,
  FaEnvelope,
  FaTrash,
  FaHistory,
  FaEdit,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import LoadingScreen from "../../components/loading/LoadingScreen";
import { Timestamp } from "firebase/firestore";
import useAuthContext from "../../context/hooks/useAuthContext";
import type { User } from "../../services/UsersService";
import { UserAvatar } from "./usersStyle";

const UsersCardsPage: React.FC = () => {
  const { users, updateUser, fetchUsers, deleteUser } = useUsersContext();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftRoles, setDraftRoles] = useState<string[]>([]);
  const [draftStatus, setDraftStatus] = useState("enabled");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: loggedUser } = useAuthContext();

  const loggedUserId = loggedUser?.id;
  const loggedUserRoles = loggedUser?.roles || [];
  const isAdminOrLeader = loggedUserRoles.some(
    (role) => role === UserRole.Admin || role === UserRole.Leader
  );

  const editableRoleOptions = useMemo(
    () => roleOptions.filter((role) => role.value !== UserRole.Guest),
    []
  );

  const statusOptions = useMemo(
    () => [
      { label: "Ativo", value: "enabled" },
      { label: "Pendente", value: "pending" },
      { label: "Desativado", value: "disabled" },
    ],
    []
  );

  const rolePriority = useMemo(
    () => [
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
      UserRole.Guest,
    ],
    []
  );

  const getRoleLabel = (role: UserRole) => {
    return roleOptions.find((r) => r.value === role)?.label || role;
  };

  const processedUsers = useMemo(() => {
    const usersWithSortedRoles = users
      .map((user) => {
        const validRoles = user.roles
          .filter((r) => r !== UserRole.Admin)
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

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return processedUsers.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.nickname?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.roles.some((role) => role.toLowerCase().includes(term)) ||
        user.status?.toLowerCase().includes(term)
    );
  }, [searchTerm, processedUsers]);

  const getStatusLabel = (status: string) => {
    return statusOptions.find((option) => option.value === status)?.label || status;
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

  const getLastSeenLabel = (timestamp?: string | Timestamp) => {
    if (!timestamp) return "nunca";

    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "agora mesmo";
    if (minutes < 60) return `ha ${minutes} min`;
    if (hours < 24) return `ha ${hours}h`;
    return `ha ${days} dia${days > 1 ? "s" : ""}`;
  };

  const handleDelete = async (id: string, userName: string, onSuccess?: () => void) => {
    if (id === loggedUserId) {
      toast.error("Voce nao pode deletar o proprio usuario.");
      return;
    }

    toast(`Deseja realmente deletar o usuario "${userName}"?`, {
      action: {
        label: "Deletar",
        onClick: async () => {
          const toastId = toast.loading("Aguarde...");
          try {
            await deleteUser(id);
            await fetchUsers();
            toast.success("Usuario deletado com sucesso!", { id: toastId });
            onSuccess?.();
          } catch (err) {
            if (err instanceof Error) {
              toast.error("Sem permissao! " + err.message, { id: toastId });
            } else {
              toast.error("Erro desconhecido ao deletar", { id: toastId });
            }
          }
        },
      },
    });
  };

  const closeModal = useCallback(() => {
    setEditingUser(null);
    setDraftName("");
    setDraftEmail("");
    setDraftRoles([]);
    setDraftStatus("enabled");
  }, []);

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setDraftName(user.name || "");
    setDraftEmail(user.email || "");
    setDraftRoles(user.roles || []);
    setDraftStatus(user.status || "pending");
  };

  const handleSaveUser = async (forceStatus?: string) => {
    if (!editingUser) return;

    const toastId = toast.loading("Aguarde...");
    setIsSubmitting(true);
    try {
      await updateUser(editingUser.id, {
        name: draftName.trim(),
        email: draftEmail.trim(),
        roles: draftRoles,
        status: forceStatus ?? draftStatus,
      });
      await fetchUsers();
      toast.success("Usuario atualizado com sucesso!", { id: toastId });
      closeModal();
    } catch (err) {
      if (err instanceof Error) {
        toast.error("Sem permissao! " + err.message, { id: toastId });
      } else {
        toast.error("Erro desconhecido ao salvar", { id: toastId });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickActivate = async () => {
    await handleSaveUser("enabled");
  };

  const handleModalDelete = async () => {
    if (!editingUser) return;
    await handleDelete(editingUser.id, editingUser.nickname || editingUser.name, closeModal);
  };

  useEffect(() => {
    if (!editingUser) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingUser, closeModal]);

  const isUserOnline = (lastSeen?: Timestamp | string) => {
    if (!lastSeen) return false;

    const date = lastSeen instanceof Timestamp ? lastSeen.toDate() : new Date(lastSeen);
    const diff = Date.now() - date.getTime();
    return diff < 5 * 60 * 1000;
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
        <PageTopBar $centerTitle={!isAdminOrLeader}>
          <h1>Usuarios</h1>
          {isAdminOrLeader && (
            <AuditLink to="/audit">
              <FaHistory size={12} />
              Auditoria
            </AuditLink>
          )}
        </PageTopBar>

        <div style={{ width: "90%", maxWidth: "600px", display: "flex", alignItems: "center", marginBottom: "40px" }}>
          <Input
            type="text"
            placeholder="Pesquisar por nome, e-mail ou funcao..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <LoadingScreen />
        ) : (
          <UsersContainer>
            {filteredUsers.map((user, index) => (
              <UserCard
                key={user.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
              >
                <UserAvatar aria-label="Avatar do usuario">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.nickname || user.name || "Foto do usuario"} />
                  ) : (
                    <FaUser />
                  )}
                </UserAvatar>

                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <FaUser style={{ marginRight: "8px" }} />
                  <strong>{user.nickname || user.name}</strong>
                  {user.id === loggedUserId ? (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#9ca3af",
                        marginLeft: "6px",
                        fontStyle: "italic",
                      }}
                    >
                      (voce)
                    </span>
                  ) : isUserOnline(user.lastSeen) ? (
                    <span style={{ color: "green", fontWeight: 500, fontSize: "0.85rem" }}>
                      Online
                    </span>
                  ) : user.status === "disabled" ? (
                    <span style={{ color: "gray", fontWeight: 500, fontSize: "0.85rem" }}>
                      Conta desativada {getLastSeenLabel(user.lastSeen)}
                    </span>
                  ) : (
                    <span style={{ color: "gray", fontWeight: 500, fontSize: "0.85rem" }}>
                      Visto {getLastSeenLabel(user.lastSeen)}
                    </span>
                  )}
                </span>

                <span>
                  <FaEnvelope style={{ marginRight: "8px" }} />
                  {user.email}
                </span>
                <span>
                  <FaCogs style={{ marginRight: "8px" }} />
                  {user.roles.map((r) => getRoleLabel(r as UserRole)).join(", ")}
                </span>
                  <span>
                  {user.status === "enabled" ? (
                    <FaCheckCircle style={{ color: "green", marginRight: "8px" }} />
                  ) : user.status === "pending" ? (
                    <FaClock style={{ color: "#f59e0b", marginRight: "8px" }} />
                  ) : (
                    <FaTimesCircle style={{ color: "red", marginRight: "8px" }} />
                  )}
                  Status: {getStatusLabel(user.status!)}
                </span>

                {isAdminOrLeader && (
                  <CardActionButton type="button" onClick={() => openEditModal(user)}>
                    <FaEdit style={{ marginRight: "6px" }} /> Editar
                  </CardActionButton>
                )}
              </UserCard>
            ))}
            {filteredUsers.length === 0 && <p>Nenhum usuario encontrado.</p>}
          </UsersContainer>
        )}
      </PageWrapper>

      {editingUser && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <ModalHeader>
              <div>
                <h2>Editar usuario</h2>
              </div>
              <CloseButton type="button" onClick={closeModal} aria-label="Fechar modal">
                <FaTimes />
              </CloseButton>
            </ModalHeader>

            <ModalBody
              onSubmit={(event) => {
                event.preventDefault();
                void handleSaveUser();
              }}
            >
              <FormGroup>
                <FieldLabel htmlFor="user-name">Nome</FieldLabel>
                <TextInput
                  id="user-name"
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  placeholder="Nome do usuario"
                  required
                />
              </FormGroup>

              <FormGroup>
                <FieldLabel htmlFor="user-email">E-mail</FieldLabel>
                <TextInput
                  id="user-email"
                  type="email"
                  value={draftEmail}
                  onChange={(event) => setDraftEmail(event.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
              </FormGroup>

              <FormGroup>
                <FieldLabel>Roles</FieldLabel>
                <RoleGrid>
                  {editableRoleOptions.map((role) => {
                    const checked = draftRoles.includes(role.value);
                    return (
                      <RoleChip key={role.value} $checked={checked}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            if (event.target.checked) {
                              setDraftRoles((current) => [...current, role.value]);
                              return;
                            }
                            setDraftRoles((current) => current.filter((item) => item !== role.value));
                          }}
                        />
                        <span>{role.label}</span>
                      </RoleChip>
                    );
                  })}
                </RoleGrid>
              </FormGroup>

              <FormGroup>
                <FieldLabel htmlFor="user-status">Status</FieldLabel>
                <SelectField
                  id="user-status"
                  value={draftStatus}
                  onChange={(event) => setDraftStatus(event.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>
              </FormGroup>

              <ModalFooter>
                {draftStatus !== "enabled" && (
                  <PrimaryActionButton
                    type="button"
                    onClick={() => void handleQuickActivate()}
                    disabled={isSubmitting}
                  >
                    <FaToggleOn style={{ marginRight: "6px" }} /> Ativar
                  </PrimaryActionButton>
                )}
                <PrimaryActionButton type="submit" disabled={isSubmitting}>
                  Salvar
                </PrimaryActionButton>
                <DangerActionButton
                  type="button"
                  onClick={() => void handleModalDelete()}
                  disabled={isSubmitting || editingUser.id === loggedUserId}
                  title={editingUser.id === loggedUserId ? "Voce nao pode deletar o proprio usuario." : undefined}
                >
                  <FaTrash style={{ marginRight: "6px" }} /> Excluir usuário
                </DangerActionButton>
              </ModalFooter>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default UsersCardsPage;
