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
import { Musicos } from "../../services/ScheduleService";
import LoadingScreen from "../../components/loading/LoadingScreen";
import useNotificationContext from "../../context/hooks/useNotificationContext";
import { toast } from "sonner";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

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

  const {
    saveOrUpdateSchedule,
    getScheduleForMonth,
    monthlySchedule,
  } = useSchedulesContext();

  // Buscar domingos do mês
  useEffect(() => {
    const sundaysList = getSundaysOfMonth(parseInt(month), year);
    setSundays(sundaysList);
  }, [month, year]);

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
  const { notification, postNotification, getNotification } = useNotificationContext();
  const [ notificationText, setNotificationText ] = useState<string>("");

  useEffect(() => {
  if (notification?.text) {
    setNotificationText(notification.text);
  }
}, [notification]);

const handleSendNotification = async () => {
  try {
    await postNotification(notificationText);
    toast.success("Notificação enviada!");
    // Atualiza para garantir que a notificação salva está atualizada
    await getNotification();
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error("Sem premissão! " + err.message);
    } else {
      toast.error("Erro desconhecido ao salvar");
    }
  }
};


  return (
    <DarkWrapper>
      <Header />
      <ContainerForm>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <DarkTitle>Preencher Escala do Mês</DarkTitle>
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

            {ordemCampos.map((key) => (
              <FormGroup key={key}>
                <DarkLabel>{labels[key] || key}:</DarkLabel>
                <DarkInput
                  type="text"
                  value={músicos[key as keyof Musicos] || ""}
                  onChange={(e) => setMúsicos((prev) => ({ ...prev, [key]: e.target.value }))}
                  required
                />
              </FormGroup>
            ))}

            <div style={{ width: "100%", boxSizing: "border-box", paddingLeft: "20px" }}>
              <DarkButton type="submit">Salvar Escala</DarkButton>
            </div>
          </DarkForm>

          <div style={{ width: "100%", borderTop: "1px solid #444", marginTop: 20 }}></div>
          <FormGroup>
            <DarkLabel>Mensagem da Notificação:</DarkLabel>
            <DarkInput
              type="text"
              value={notificationText}
              onChange={(e) => setNotificationText(e.target.value)}
              placeholder="Digite a mensagem da notificação"
            />
            <DarkButton type="button" onClick={handleSendNotification} style={{ marginTop: 15 }}>
              Enviar Notificação
            </DarkButton>
          </FormGroup>
        </>
      )}
      </ContainerForm>
      <Footer />
    </DarkWrapper>
  );
};

export default ScheduleForm;