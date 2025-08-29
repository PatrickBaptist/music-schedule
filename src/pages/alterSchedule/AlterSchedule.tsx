import React, { useEffect, useState } from "react";
import {
  DarkForm,
  DarkInput,
  DarkLabel,
  DarkTitle,
  DarkWrapper,
  DarkSelect,
  DarkButton,
  FormGroup,
  ContainerForm,
} from "./AlterScheduleStyle";
import useSchedulesContext from "../../context/hooks/useScheduleContext";
import { Musicos, SpecialSchedule } from "../../services/ScheduleService";
import LoadingScreen from "../../components/loading/LoadingScreen";
import useNotificationContext from "../../context/hooks/useNotificationContext";
import { toast } from "sonner";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageWrapper from "../../components/pageWrapper/pageWrapper";
import { UserRole } from "../../types/UserRole";
import useUsersContext from "../../context/hooks/useUsersContext";

const ScheduleForm: React.FC = () => {
  const [month, setMonth] = useState<string>("01");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [date, setDate] = useState("");
  const [músicos, setMúsicos] = useState<Musicos>({
    teclas: "",
    violao: "",
    batera: "",
    bass: "",
    guita: "",
    vocal1: "",
    vocal2: "",
  });
  const [sundays, setSundays] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { users } = useUsersContext();

  const musiciansBySkill: Record<string, string[]> = {
    vocal: [
      ...users
        .filter(u => u.roles?.includes(UserRole.Vocal))
        .map(u => u.nickname!.trim()), // <-- trim aqui
      "Convidado"
    ],
    teclas: [
      ...users
        .filter(u => u.roles?.includes(UserRole.Keyboard))
        .map(u => u.nickname!.trim()),
      "Convidado"
    ],
    violao: [
      ...users
        .filter(u => u.roles?.includes(UserRole.Violao))
        .map(u => u.nickname!.trim()),
      "Convidado"
    ],
    bass: [
      ...users
        .filter(u => u.roles?.includes(UserRole.Bass))
        .map(u => u.nickname!.trim()),
      "Convidado"
    ],
    guita: [
      ...users
        .filter(u => u.roles?.includes(UserRole.Guitar))
        .map(u => u.nickname!.trim()),
      "Convidado"
    ],
    batera: [
      ...users
        .filter(u => u.roles?.includes(UserRole.Drums))
        .map(u => u.nickname!.trim()),
      "Convidado"
    ],
  };

console.log(musiciansBySkill);

  const labels: Record<string, string> = {
    teclas: "Teclado",
    violao: "Violão",
    batera: "Bateria",
    bass: "Baixo",
    guita: "Guitarra",
    vocal1: "Vocal 1",
    vocal2: "Vocal 2",
  };

  const ordemCampos = ["teclas", "violao", "batera", "bass", "guita", "vocal1", "vocal2"];

  const { saveOrUpdateSchedule, getScheduleForMonth, monthlySchedule, postSpecialSchedules, getSpecialSchedules, specialSchedules } = useSchedulesContext();
  const [specialMusicos, setSpecialMusicos] = useState<SpecialSchedule>({
    evento: "",
    data: "",
    vocal1: "",
    vocal2: "",
    teclas: "",
    violao: "",
    batera: "",
    bass: "",
    guita: "",
  });

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

    const found = monthlySchedule.find((s) => s.date.slice(0, 10) === date.slice(0, 10));
    if (found) setMúsicos(found.músicos);
    else
      setMúsicos({
        teclas: "",
        violao: "",
        batera: "",
        bass: "",
        guita: "",
        vocal1: "",
        vocal2: "",
      });

    setIsLoading(false);

  }, [date, monthlySchedule]);

  useEffect(() => {
    if (!specialMusicos.data || !specialSchedules) return;

    const found = specialSchedules.find(
      (s) => s.data.slice(0, 10) === specialMusicos.data.slice(0, 10)
    );

    if (found) setSpecialMusicos(found); 
  }, [specialMusicos.data, specialSchedules]);


  const handleAddSpecialSchedule = async () => {
    if (!specialMusicos.evento || !specialMusicos.data) return toast.error("Evento e data obrigatórios!");

    const payload = { schedules: [specialMusicos] };
    
    try {
      await postSpecialSchedules(payload);
      toast.success("Escala especial adicionada!");
      setSpecialMusicos({
        evento: "",
        data: "",
        vocal1: "",
        vocal2: "",
        teclas: "",
        violao: "",
        batera: "",
        bass: "",
        guita: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar escala especial");
    }
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      month,
      year: year.toString(),
      date,
      músicos,
    };

    
    try {
      setIsLoading(true);
      await saveOrUpdateSchedule(payload);
      toast.success("Escala salva com sucesso!");
      setIsLoading(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Sem premissão! " + err.message);
      } else {
        toast.error("Erro desconhecido ao salvar");
    }
    } finally {
      setIsLoading(false); 
    }
  };

//notificações
  const { notification, postNotification, getNotification,  warning, getWarning, postWarning } = useNotificationContext();
  const [ notificationText, setNotificationText ] = useState<string>("");
  const [warningText, setWarningText] = useState<string>("");

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
    <DarkWrapper>
      <Header />
        <ContainerForm>
          <PageWrapper>
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <div style={{ width: "100%", gap: "45px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <DarkTitle>Gerenciador</DarkTitle>
              <h2>Escala de domingo</h2>
              <DarkForm onSubmit={handleSubmit}>
                <FormGroup>
                  <DarkLabel>Mês:</DarkLabel>
                  <DarkSelect value={month} onChange={(e) => setMonth(e.target.value)} required>
                    {Array.from({ length: 12 }, (_, index) => (
                      <option key={index} value={(index + 1).toString().padStart(2, "0")}>
                        {new Date(0, index).toLocaleString("default", { month: "long" })}
                      </option>
                    ))}
                  </DarkSelect>
                </FormGroup>

                <FormGroup>
                  <DarkLabel>Ano:</DarkLabel>
                  <DarkInput
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    min={2000}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <DarkLabel>Data (Domingo):</DarkLabel>
                  <DarkSelect value={date} onChange={(e) => setDate(e.target.value)} required>
                    <option value="">Selecione um domingo</option>
                    {sundays.map((sunday, index) => (
                      <option key={index} value={sunday.toISOString()}>
                        {sunday.toLocaleDateString()}
                      </option>
                    ))}
                  </DarkSelect>
                </FormGroup>

                {ordemCampos.map((key) => {
                  const skillKey = key.startsWith("vocal") ? "vocal" : key;
                  const options = musiciansBySkill[skillKey] || [];

                  const isVocal = key.startsWith("vocal");

                  return (
                    <FormGroup key={key}>
                      <DarkLabel>{labels[key] || key}:</DarkLabel>
                      <DarkSelect
                        multiple={isVocal}
                        value={
                          isVocal
                            ? (músicos[key as keyof Musicos] as string)
                                ?.split(",")
                                .map((s) => s.trim()) || []
                            : músicos[key as keyof Musicos] || ""
                        }
                        onChange={(e) => {
                          if (isVocal) {
                            const selected = Array.from(
                              e.target.selectedOptions,
                              (opt) => opt.value
                            );
                            setMúsicos((prev) => ({
                              ...prev,
                              [key]: selected.join(", "),
                            }));
                          } else {
                            setMúsicos((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }));
                          }
                        }}
                      >
                        {!isVocal && <option value="">Selecione</option>}
                        {options.map((musico) => (
                          <option key={musico} value={musico}>
                            {musico}
                          </option>
                        ))}
                      </DarkSelect>
                    </FormGroup>
                  );
                })}
                <DarkButton type="submit">Salvar Escala</DarkButton>
              </DarkForm>

              <div style={{ width: "100%", borderTop: "1px solid #444", marginTop: 20 }}></div>
              <DarkForm>
                <h2>Escala especial</h2>
                <FormGroup>
                  <DarkLabel>Evento:</DarkLabel>
                  <DarkInput
                    type="text"
                    value={specialMusicos.evento}
                    onChange={(e) =>
                      setSpecialMusicos((prev) => ({ ...prev, evento: e.target.value }))
                    }
                    placeholder="Nome do evento"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <DarkLabel>Data:</DarkLabel>
                  <DarkInput
                    type="date"
                    value={specialMusicos.data}
                    onChange={(e) =>
                      setSpecialMusicos((prev) => ({ ...prev, data: e.target.value }))
                    }
                    required
                  />
                </FormGroup>

                {ordemCampos.map((key) => {
                  const skillKey = key.startsWith("vocal") ? "vocal" : key;
                  const options = musiciansBySkill[skillKey] || [];

                  const isVocal = key.startsWith("vocal");

                  return (
                    <FormGroup key={key}>
                      <DarkLabel>{labels[key] || key}:</DarkLabel>
                      <DarkSelect
                        multiple={isVocal}
                        value={
                          isVocal
                            ? (specialMusicos[key as keyof SpecialSchedule] as string)
                                ?.split(",")
                                .map((s) => s.trim()) || []
                            : specialMusicos[key as keyof SpecialSchedule] || ""
                        }
                        onChange={(e) => {
                          if (isVocal) {
                            const selected = Array.from(
                              e.target.selectedOptions,
                              (opt) => opt.value
                            );
                            setSpecialMusicos((prev) => ({
                              ...prev,
                              [key]: selected.join(", "),
                            }));
                          } else {
                            setSpecialMusicos((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }));
                          }
                        }}
                      >
                        {!isVocal && <option value="">Selecione</option>}
                        {options.map((musico) => (
                          <option key={musico} value={musico}>
                            {musico}
                          </option>
                        ))}
                      </DarkSelect>
                    </FormGroup>
                  );
                })}
                <DarkButton
                  type="button"
                  onClick={handleAddSpecialSchedule}
                  style={{ marginTop: 15 }}
                >
                  Adicionar Escala Especial
                </DarkButton>
              </DarkForm>

              <div style={{ width: "100%", borderTop: "1px solid #444", marginTop: 20 }}></div>
              <DarkForm>
                <FormGroup>
                  <DarkLabel>Mensagem da Notificação:</DarkLabel>
                  <DarkInput
                    type="text"
                    value={notificationText}
                    onChange={(e) => setNotificationText(e.target.value)}
                    placeholder="Digite a mensagem da notificação"
                  />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}> 
                    <DarkButton type="button" onClick={handleSendNotification} style={{ marginTop: 15 }}>
                      Enviar Notificação
                    </DarkButton>
                  </div>
                </FormGroup>
              </DarkForm>

              <div style={{ width: "100%", borderTop: "1px solid #444", marginTop: 20 }}></div>
              <DarkForm>
                <FormGroup>
                  <DarkLabel>Mensagem de Aviso:</DarkLabel>
                  <DarkInput
                    type="text"
                    value={warningText}
                    onChange={(e) => setWarningText(e.target.value)}
                    placeholder="Digite a mensagem do aviso"
                    />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}> 
                      <DarkButton type="button" onClick={handleSendWarning} style={{ marginTop: 15, marginBottom: 50 }}>
                      Enviar Aviso
                      </DarkButton>
                    </div>
                </FormGroup>
              </DarkForm>
            </div>
          )}
          </PageWrapper>
        </ContainerForm>
      <Footer />
    </DarkWrapper>
  );
};

export default ScheduleForm;