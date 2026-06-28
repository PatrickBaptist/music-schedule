import React, { useEffect, useMemo, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import PageWrapper from '../../components/pageWrapper/pageWrapper';
import { StyledInputMask } from '../register/registerStyle';
import {
  Badge,
  CompletionBody,
  CompletionSection,
  CompletionSectionActions,
  CompletionSectionHint,
  CompletionSectionTitle,
  ContainerForm,
  DarkButton,
  DarkForm,
  DarkInput,
  DarkLabel,
  FormGroup,
  ProfileAvatar,
  ProfileItem,
  ProfileList,
  ProfileTitle,
} from './meStyle';
import useAuthContext from '../../context/hooks/useAuthContext';
import { roleOptions, UserRole } from '../../types/UserRole';
import { FaCogs, FaEdit, FaEnvelope, FaPhoneAlt, FaSave, FaTag, FaUser, FaTimes } from 'react-icons/fa';
import LoadingScreen from '../../components/loading/LoadingScreen';
import useSchedulesContext from '../../context/hooks/useScheduleContext';
import useNotificationContext from '../../context/hooks/useNotificationContext';
import { toast } from 'sonner';
import { createEmptyMusicos, Musicos, normalizeMusicos } from '../../services/ScheduleService';
import {
  CloseButton,
  FieldLabel,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PrimaryActionButton,
} from '../users/usersStyle';
import { auth } from '../../firebaseConfig';
import { getPendingProfileFields } from '../../helpers/profileCompletion';
import { useLocation, useNavigate } from 'react-router-dom';

const MePage: React.FC = () => {
  const { user, updateMyProfile } = useAuthContext();
  const [ isLoading, setIsLoading ] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
      notification,
      postNotification,
      getNotification,
      warning,
      getWarning,
      postWarning,
    } = useNotificationContext();
  const [notificationText, setNotificationText] = useState<string>("");
  const [warningText, setWarningText] = useState<string>("");
  const [profileDraft, setProfileDraft] = useState({
    name: "",
    nickname: "",
    phone: "",
    birthDate: "",
  });

  const formatPhone = (phone?: string) => {
    if (!phone) return "não cadastrado";

    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 11) return phone;

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const loggedRoles = user?.roles || [];
  const allowedRoles = [UserRole.Leader, UserRole.Minister, UserRole.Admin, UserRole.Vocal];
  const canAddwarning = loggedRoles.some(role => allowedRoles.includes(role as UserRole));

  const isGuest = user?.roles?.includes(UserRole.Guest);

  const profileInitials = useMemo(() => {
    const sourceName = user?.nickname || user?.name || user?.email || "";
    return sourceName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";
  }, [user?.email, user?.name, user?.nickname]);

  const pendingProfileFields = useMemo(() => getPendingProfileFields(user), [user]);
  const shouldShowCompletionBadge = !isGuest && pendingProfileFields.length > 0;
  const completionRequested = Boolean((location.state as { openCompletion?: boolean } | null)?.openCompletion);

  useEffect(() => {
    setIsLoading(!user);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    setProfileDraft({
      name: user.name || "",
      nickname: user.nickname || "",
      phone: user.phone || "",
      birthDate: user.birthDate || "",
    });
  }, [user]);

  useEffect(() => {
    if (!completionRequested) {
      return;
    }

    if (pendingProfileFields.length > 0) {
      setIsCompletionModalOpen(true);
    }

    navigate(location.pathname, { replace: true, state: {} });
  }, [completionRequested, location.pathname, navigate, pendingProfileFields.length]);

  useEffect(() => {
    if (pendingProfileFields.length === 0 && isCompletionModalOpen) {
      setIsCompletionModalOpen(false);
    }
  }, [isCompletionModalOpen, pendingProfileFields.length]);

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

  const [month,] = useState<string>(
      (new Date().getMonth() + 1).toString().padStart(2, "0")
    );
    const [year] = useState<number>(new Date().getFullYear());
    const [date] = useState("");
    const [, setMúsicos] = useState<Musicos>({
      ...createEmptyMusicos(),
    });
    const [, setSundays] = useState<Date[]>([]);
  
    const {
      
      getScheduleForMonth,
      monthlySchedule,
      
      getSpecialSchedules,
      
    } = useSchedulesContext();
  
    // Buscar domingos do mês
    useEffect(() => {
      const sundaysList = getSundaysOfMonth(parseInt(month), year);
      setSundays(sundaysList);
    }, [month, year]);
  
    useEffect(() => {
      getSpecialSchedules();
    }, [getSpecialSchedules]);
  
    // Buscar escala do mês quando mudar mês ou ano
    useEffect(() => {
      const fetchSchedule = async () => {
        setIsLoading(true);
        try {
          await getScheduleForMonth(`${month}-${year}`);
        } catch (err) {
          console.error("Erro ao carregar escala:", err);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchSchedule();
    }, [getScheduleForMonth, month, year]);
  
    // Preenche os músicos se já houver dados salvos para a data
    useEffect(() => {
      if (!date || !monthlySchedule) return;
  
      setIsLoading(true);
  
      const found = monthlySchedule.find(
        (s) => s.date.slice(0, 10) === date.slice(0, 10)
      );
      if (found) setMúsicos(normalizeMusicos(found.músicos));
      else setMúsicos(createEmptyMusicos());
  
      setIsLoading(false);
    }, [date, monthlySchedule]);
  
    const getSundaysOfMonth = (month: number, year: number): Date[] => {
      const date = new Date(year, month - 1, 1);
      const sundays: Date[] = [];
  
      while (date.getMonth() === month - 1) {
        if (date.getDay() === 0) {
          sundays.push(new Date(date));
        }
        date.setDate(date.getDate() + 1);
      }
  
      return sundays;
    };
  
    useEffect(() => {
      if (notification?.text) {
        setNotificationText(notification.text);
      }
    }, [notification]);
  
    useEffect(() => {
      if (warning?.text) {
        setWarningText(warning.text);
      }
    }, [warning]);
  
    useEffect(() => {
      getWarning();
    }, [getWarning]);
  
    const handleSendNotification = async () => {
      const toastId = toast.loading("Enviando notificação...");
      try {
        await postNotification(notificationText);
        toast.success("Notificação enviada!", { id: toastId });
        await getNotification();
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error("Sem premissão! " + err.message, { id: toastId });
        } else {
          toast.error("Erro desconhecido ao salvar", { id: toastId });
        }
      }
    };
  
  const handleSendWarning = async () => {
      const toastId = toast.loading("Enviando aviso...");
      try {
        await postWarning(warningText);
        toast.success("Aviso enviado!", { id: toastId });
        await getWarning();
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error("Sem permissão! " + err.message, { id: toastId });
        } else {
          toast.error("Erro desconhecido ao salvar", { id: toastId });
        }
    }
  };

  const handleCompletionUpdate = async (payload: {
    nickname?: string;
    phone?: string;
    photoURL?: string;
    birthDate?: string;
  }) => {
    const toastId = toast.loading("Atualizando seu cadastro...");
    try {
      await updateMyProfile(payload);
      toast.success("Cadastro atualizado.", { id: toastId });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message, { id: toastId });
      } else {
        toast.error("Erro desconhecido ao salvar", { id: toastId });
      }
    }
  };

  const handleImportGooglePhoto = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const toastId = toast.loading("Buscando sua foto do Google...");

    try {
      const result = await signInWithPopup(auth, provider);
      const photoURL = result.user.photoURL?.trim();
      await signOut(auth).catch(() => undefined);

      if (!photoURL) {
        throw new Error("Nao foi possivel encontrar uma foto no Google.");
      }

      await updateMyProfile({ photoURL });
      toast.success("Foto importada.", { id: toastId });
    } catch (err: unknown) {
      await signOut(auth).catch(() => undefined);
      if (err instanceof Error) {
        toast.error(err.message, { id: toastId });
      } else {
        toast.error("Erro desconhecido ao importar a foto", { id: toastId });
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    const toastId = toast.loading("Salvando seus dados...");
    setIsSavingProfile(true);

    try {
      await updateMyProfile({
        name: profileDraft.name,
        nickname: profileDraft.nickname,
        phone: profileDraft.phone,
      });
      setIsEditingProfile(false);
      toast.success("Seus dados foram atualizados.", { id: toastId });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message, { id: toastId });
      } else {
        toast.error("Erro desconhecido ao salvar", { id: toastId });
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div style={{ marginTop: '150px' }}>
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
              <ProfileAvatar aria-label="Foto do perfil">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name || "Foto do usuario"} />
                ) : (
                  <span>{profileInitials}</span>
                )}
              </ProfileAvatar>

              {!isGuest && (
                <>
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
                    transition={{ delay: 0.35 }}
                  >
                    <FaPhoneAlt style={{ marginRight: "8px", color: "#8b5cf6" }} />
                    <strong>Telefone:</strong> {formatPhone(user.phone)}
                  </ProfileItem>
                </>
              )}

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

              <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "18px" }}>
                <DarkButton type="button" onClick={() => setIsEditingProfile((current) => !current)}>
                  <FaEdit style={{ marginRight: "6px" }} />
                  {isEditingProfile ? "Fechar edição" : "Editar meus dados"}
                </DarkButton>
              </div>
            </ProfileList>
          )}
        </PageWrapper>
      )}

      {isCompletionModalOpen && user && shouldShowCompletionBadge && (
        <ModalOverlay onClick={() => setIsCompletionModalOpen(false)}>
          <ModalContent
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <ModalHeader>
              <div>
                <h2>Completar cadastro</h2>
                <p>Preencha apenas o que ainda está faltando.</p>
              </div>
              <CloseButton type="button" onClick={() => setIsCompletionModalOpen(false)} aria-label="Fechar modal">
                <FaTimes />
              </CloseButton>
            </ModalHeader>

            <CompletionBody>
              {pendingProfileFields.includes("photoURL") && (
                <CompletionSection>
                  <CompletionSectionTitle>Foto de perfil</CompletionSectionTitle>
                  <CompletionSectionHint>
                    Adicione uma foto para facilitar sua identificação dentro do sistema.
                  </CompletionSectionHint>
                  <CompletionSectionActions>
                    <PrimaryActionButton type="button" onClick={() => void handleImportGooglePhoto()}>
                      Importar foto do Google
                    </PrimaryActionButton>
                  </CompletionSectionActions>
                </CompletionSection>
              )}

              {pendingProfileFields.includes("nickname") && (
                <CompletionSection>
                  <CompletionSectionTitle>Apelido</CompletionSectionTitle>
                  <CompletionSectionHint>
                    Informe como você gostaria de aparecer nas escalas.
                  </CompletionSectionHint>
                  <FormGroup>
                    <FieldLabel htmlFor="completion-nickname">Apelido</FieldLabel>
                    <DarkInput
                      id="completion-nickname"
                      value={profileDraft.nickname}
                      onChange={(event) => setProfileDraft((current) => ({ ...current, nickname: event.target.value }))}
                      placeholder="____________________"
                    />
                  </FormGroup>
                  <CompletionSectionActions>
                    <PrimaryActionButton
                      type="button"
                      onClick={() => void handleCompletionUpdate({ nickname: profileDraft.nickname })}
                    >
                      Salvar
                    </PrimaryActionButton>
                  </CompletionSectionActions>
                </CompletionSection>
              )}

              {pendingProfileFields.includes("phone") && (
                <CompletionSection>
                  <CompletionSectionTitle>Telefone</CompletionSectionTitle>
                  <CompletionSectionHint>
                    Informe um telefone para facilitar o contato da liderança.
                  </CompletionSectionHint>
                  <FormGroup>
                    <FieldLabel htmlFor="completion-phone">Telefone</FieldLabel>
                    <StyledInputMask
                      id="completion-phone"
                      mask="(99) 9 9999-9999"
                      maskChar=""
                      value={profileDraft.phone}
                      onChange={(event) => setProfileDraft((current) => ({ ...current, phone: event.target.value }))}
                      placeholder="(21) 99999-9999"
                    />
                  </FormGroup>
                  <CompletionSectionActions>
                    <PrimaryActionButton
                      type="button"
                      onClick={() => void handleCompletionUpdate({ phone: profileDraft.phone })}
                    >
                      Salvar
                    </PrimaryActionButton>
                  </CompletionSectionActions>
                </CompletionSection>
              )}

              {pendingProfileFields.includes("birthDate") && (
                <CompletionSection>
                  <CompletionSectionTitle>Data de aniversário</CompletionSectionTitle>
                  <CompletionSectionHint>
                    Informe sua data de aniversário para melhorar sua identificação no sistema.
                  </CompletionSectionHint>
                  <FormGroup>
                    <FieldLabel htmlFor="completion-birthDate">Data de aniversário</FieldLabel>
                    <DarkInput
                      id="completion-birthDate"
                      type="date"
                      value={profileDraft.birthDate}
                      onChange={(event) => setProfileDraft((current) => ({ ...current, birthDate: event.target.value }))}
                    />
                  </FormGroup>
                  <CompletionSectionActions>
                    <PrimaryActionButton
                      type="button"
                      onClick={() => void handleCompletionUpdate({ birthDate: profileDraft.birthDate })}
                    >
                      Salvar
                    </PrimaryActionButton>
                  </CompletionSectionActions>
                </CompletionSection>
              )}
            </CompletionBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {isEditingProfile && user && (
        <ModalOverlay onClick={() => setIsEditingProfile(false)}>
          <ModalContent
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <ModalHeader>
              <div>
                <h2>Editar meus dados</h2>
              </div>
              <CloseButton type="button" onClick={() => setIsEditingProfile(false)} aria-label="Fechar modal">
                <FaTimes />
              </CloseButton>
            </ModalHeader>

            <ModalBody
              onSubmit={(event) => {
                event.preventDefault();
                void handleSaveProfile();
              }}
            >
              <FormGroup>
                <FieldLabel htmlFor="profile-name">Nome</FieldLabel>
                <DarkInput
                  id="profile-name"
                  value={profileDraft.name}
                  onChange={(event) => setProfileDraft((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Seu nome"
                />
              </FormGroup>

              <FormGroup>
                <FieldLabel htmlFor="profile-nickname">Apelido</FieldLabel>
                <DarkInput
                  id="profile-nickname"
                  value={profileDraft.nickname}
                  onChange={(event) => setProfileDraft((current) => ({ ...current, nickname: event.target.value }))}
                  placeholder="Seu apelido"
                />
              </FormGroup>

              <FormGroup>
                <FieldLabel htmlFor="profile-phone">Telefone</FieldLabel>
                <StyledInputMask
                  id="profile-phone"
                  mask="(99) 9 9999-9999"
                  maskChar=""
                  value={profileDraft.phone}
                  onChange={(event) => setProfileDraft((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="(00) 9 0000-0000"
                />
              </FormGroup>

              <ModalFooter>
                <PrimaryActionButton type="submit" disabled={isSavingProfile}>
                  <FaSave style={{ marginRight: "6px" }} />
                  Salvar
                </PrimaryActionButton>
              </ModalFooter>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {canAddwarning && (
        <ContainerForm>
          <div className="form-row">
            <div className="form-column">
              <div className="form-container">
                <div className="form-content">
                  <DarkForm
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <FormGroup>
                      <DarkLabel>Mensagem da Notificação:</DarkLabel>
                      <DarkInput
                        type="text"
                        value={notificationText}
                        onChange={(e) =>
                          setNotificationText(e.target.value)
                        }
                        placeholder="Digite a mensagem da notificação"
                      />
                    </FormGroup>
                    <div className="button-container">
                      <DarkButton type="button" onClick={handleSendNotification}>
                        Enviar
                      </DarkButton>
                  </div>
                  </DarkForm>
                </div>
              </div>
            </div>

            <div className="form-column">
              <div className="form-container">
                <div className="form-content">
                  <DarkForm
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <FormGroup>
                      <DarkLabel>Mensagem de Aviso:</DarkLabel>
                      <DarkInput
                        type="text"
                        value={warningText}
                        onChange={(e) => setWarningText(e.target.value)}
                        placeholder="Digite a mensagem do aviso"
                      />
                    </FormGroup>
                    <div className="button-container">
                      <DarkButton type="button" onClick={handleSendWarning}>
                        Enviar
                      </DarkButton>
                    </div>
                  </DarkForm>
                </div>
              </div>
            </div>
          </div>
        </ContainerForm>
      )}
    </div>
  );
};

export default MePage;
