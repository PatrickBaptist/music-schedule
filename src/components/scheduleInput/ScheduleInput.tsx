import React, { useEffect, useState } from "react";
import { Musicos } from "../../services/ScheduleService";
import { ContainerForm, DarkButton, DarkButtonCancel, DarkForm, DarkInput, DarkLabel, DarkSelect, FormGroup } from "./ScheduleInputStyle";
import useUsersContext from "../../context/hooks/useUsersContext";
import { UserRole } from "../../types/UserRole";
import useSchedulesContext from "../../context/hooks/useScheduleContext";
import { toast } from "sonner";

type ScheduleInputProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ScheduleInput: React.FC<ScheduleInputProps> = ({ setIsModalOpen }) => {
  const [month, setMonth] = useState<string>(
    (new Date().getMonth() + 1).toString().padStart(2, "0")
  );
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [date, setDate] = useState("");
  const [músicos, setMúsicos] = useState<Musicos>({
    minister: "",
    teclas: "",
    violao: "",
    batera: "",
    bass: "",
    guita: "",
    vocal1: "",
    vocal2: "",
    sound: "",
    outfitColor: "",
  });
  const [sundays, setSundays] = useState<Date[]>([]);
  const [, setIsLoading] = useState<boolean>(true);
  const { users } = useUsersContext();

  const musiciansBySkill: Record<string, string[]> = {
    minister: [
      ...users
        .filter((u) => u.roles?.includes(UserRole.Minister))
        .map((u) => u.nickname!.trim()),
      "Convidado",
    ],
    vocal: [
      ...users
        .filter((u) => u.roles?.includes(UserRole.Vocal))
        .map((u) => u.nickname!.trim()),
        "Convidado",
        "Todos cantam",
    ],
    teclas: [
      ...users
        .filter((u) => u.roles?.includes(UserRole.Keyboard))
        .map((u) => u.nickname!.trim()),
      "Convidado",
    ],
    violao: [
      ...users
        .filter((u) => u.roles?.includes(UserRole.Violao))
        .map((u) => u.nickname!.trim()),
      "Convidado",
    ],
    bass: [
      ...users
        .filter((u) => u.roles?.includes(UserRole.Bass))
        .map((u) => u.nickname!.trim()),
      "Convidado",
    ],
    guita: [
      ...users
        .filter((u) => u.roles?.includes(UserRole.Guitar))
        .map((u) => u.nickname!.trim()),
      "Convidado",
    ],
    batera: [
      ...users
        .filter((u) => u.roles?.includes(UserRole.Drums))
        .map((u) => u.nickname!.trim()),
      "Convidado",
    ],
    sound: [
      ...users
        .filter((u) => u.roles?.includes(UserRole.Sound))
        .map((u) => u.nickname!.trim()),
      "Convidado",
    ],
  };

  const labels: Record<string, string> = {
    minister: "Ministro",
    teclas: "Teclado",
    violao: "Violão",
    batera: "Bateria",
    bass: "Baixo",
    guita: "Guitarra",
    sound: "Op. Som",
    vocal1: "Vocal",
  };

  const ordemCampos = [
    "minister",
    "teclas",
    "violao",
    "batera",
    "bass",
    "guita",
    "sound",
    "vocal1",
  ];

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
        vocal1: "",
        vocal2: "",
        sound: "",
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

  const handleSubmit = async () => {
    const toastId = toast.loading("Aguarde...");

    const payload = {
      month,
      year: year.toString(),
      date,
      músicos,
    };

    setIsModalOpen(false);

    try {
      await saveOrUpdateSchedule(payload);
      toast.success("Escala salva com sucesso!", { id: toastId });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Sem premissão! " + err.message, { id: toastId });
      } else {
        toast.error("Erro desconhecido ao salvar", { id: toastId });
      }
    }
  };

  return (
    <ContainerForm>
      <div className="form-column">
        <div className="form-container">
          <h2>Escala de domingo</h2>
          <div className="form-content">
            <DarkForm>
              <FormGroup>
                <DarkLabel>Mês:</DarkLabel>
                <DarkSelect
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                >
                  {Array.from({ length: 12 }, (_, index) => (
                    <option
                      key={index}
                      value={(index + 1).toString().padStart(2, "0")}
                    >
                      {new Date(0, index).toLocaleString("default", {
                        month: "long",
                      })}
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
                <DarkSelect
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                >
                  <option value="">Selecione um domingo</option>
                  {sundays.map((sunday, index) => (
                    <option key={index} value={sunday.toISOString()}>
                      {sunday.toLocaleDateString()}
                    </option>
                  ))}
                </DarkSelect>
              </FormGroup>

              {ordemCampos.map((key) => {
                const skillKey = key.startsWith("vocal")
                  ? "vocal"
                  : key;
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
                      {!isVocal && (
                        <option value="">Selecione</option>
                      )}
                      {options.map((musico) => (
                        <option key={musico} value={musico}>
                          {musico}
                        </option>
                      ))}
                    </DarkSelect>
                  </FormGroup>
                );
              })}
              <FormGroup>
                <DarkLabel>Cor da Roupa:</DarkLabel>
                <DarkInput
                  type="text"
                  value={músicos.outfitColor || ""}
                  onChange={(e) =>
                    setMúsicos((prev) => ({ ...prev, outfitColor: e.target.value }))
                  }
                  placeholder="Ex.: Preto e branco"
                />
              </FormGroup>
              <div className="button-container">
                <DarkButtonCancel
                  type="button"
                  onClick={setIsModalOpen.bind(null, false)}
                >
                  Cancelar
                </DarkButtonCancel>
                <DarkButton
                  type="button"
                  onClick={handleSubmit}
                >
                  Salvar Escala
                </DarkButton>
              </div>
            </DarkForm>
          </div>
        </div>
      </div>
    </ContainerForm>
  );
};

export default ScheduleInput;