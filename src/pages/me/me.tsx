import React, { useEffect, useMemo, useState } from 'react';
import PageWrapper from '../../components/pageWrapper/pageWrapper';
import { Badge, ContainerForm, DarkButton, DarkForm, DarkInput, DarkLabel, FormGroup, ProfileItem, ProfileList, ProfileTitle } from './meStyle';
import useAuthContext from '../../context/hooks/useAuthContext';
import { roleOptions, UserRole } from '../../types/UserRole';
import { FaCogs, FaEnvelope, FaTag, FaUser } from 'react-icons/fa';
import LoadingScreen from '../../components/loading/LoadingScreen';
import useSchedulesContext from '../../context/hooks/useScheduleContext';
import useNotificationContext from '../../context/hooks/useNotificationContext';
import { toast } from 'sonner';
import { Musicos } from '../../services/ScheduleService';

const MePage: React.FC = () => {
  const { user } = useAuthContext();
  const [ isLoading, setIsLoading ] = useState(true);
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

  const loggedRoles = user?.roles || [];
  const allowedRoles = [UserRole.Leader, UserRole.Minister, UserRole.Admin, UserRole.Vocal];
  const canAddwarning = loggedRoles.some(role => allowedRoles.includes(role as UserRole));

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

  const [month,] = useState<string>(
      (new Date().getMonth() + 1).toString().padStart(2, "0")
    );
    const [year] = useState<number>(new Date().getFullYear());
    const [date] = useState("");
    const [, setMúsicos] = useState<Musicos>({
      minister: "",
      teclas: "",
      violao: "",
      batera: "",
      bass: "",
      guita: "",
      sound: "",
      vocal1: "",
      vocal2: "",
      outfitColor: "",
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
      if (found) setMúsicos(found.músicos);
      else
        setMúsicos({
          minister: "",
          teclas: "",
          violao: "",
          batera: "",
          bass: "",
          guita: "",
          sound: "",
          vocal1: "",
          vocal2: "",
          outfitColor: "",
        });
  
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