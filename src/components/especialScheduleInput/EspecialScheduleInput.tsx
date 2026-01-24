import React, { useEffect, useState } from "react";
import { Musicos, SpecialSchedule } from "../../services/ScheduleService";
import { ContainerForm, DarkButton, DarkButtonCancel, DarkForm, DarkInput, DarkLabel, DarkSelect, FormGroup } from "./EspecialScheduleInputStyle";
import useUsersContext from "../../context/hooks/useUsersContext";
import { UserRole } from "../../types/UserRole";
import useSchedulesContext from "../../context/hooks/useScheduleContext";
import { toast } from "sonner";

type EspecialScheduleInputProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EspecialScheduleInput: React.FC<EspecialScheduleInputProps> = ({ setIsModalOpen }) => {

  const [month] = useState<string>(
    (new Date().getMonth() + 1).toString().padStart(2, "0")
  );
  const [year] = useState<number>(new Date().getFullYear());
  const [date] = useState("");
  const [, setMusicos] = useState<Musicos>({
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
    getScheduleForMonth,
    monthlySchedule,
    postSpecialSchedules,
    getSpecialSchedules,
    specialSchedules,
  } = useSchedulesContext();
  const [specialMusicos, setSpecialMusicos] = useState<SpecialSchedule>({
    id: "",
    evento: "",
    data: "",
    minister: "",
    vocal1: "",
    vocal2: "",
    teclas: "",
    violao: "",
    batera: "",
    bass: "",
    guita: "",
    sound: "",
    outfitColor: "",
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

    const found = monthlySchedule.find(
      (s) => s.date.slice(0, 10) === date.slice(0, 10)
    );
    if (found) setMusicos(found.músicos);
    else
      setMusicos({
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

  useEffect(() => {
    if (!specialMusicos.data || !specialSchedules) return;

    const found = specialSchedules.find(
      (s) => s.data.slice(0, 10) === specialMusicos.data.slice(0, 10)
    );

    if (found) setSpecialMusicos(found);
  }, [specialMusicos.data, specialSchedules]);
  
  const handleAddSpecialSchedule = async () => {
    if (!specialMusicos.evento || !specialMusicos.data)
      return toast.error("Evento e data obrigatórios!");

    const toastId = toast.loading("Aguarde...");

    const payload = { schedules: [specialMusicos] };

    setIsModalOpen(false);

    try {
      await postSpecialSchedules(payload);
      toast.success("Escala especial adicionada! ", { id: toastId });
      setSpecialMusicos({
        id: "",
        evento: "",
        data: "",
        minister: "",
        vocal1: "",
        vocal2: "",
        teclas: "",
        violao: "",
        batera: "",
        bass: "",
        guita: "",
        sound: "",
        outfitColor: "",
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

  return (
    <ContainerForm>
      <div className="form-column">
        <div className="form-container">
          <h2>Escala especial</h2>
          <div className="form-content">
            <DarkForm>
              <FormGroup>
                <DarkLabel>Evento:</DarkLabel>
                <DarkInput
                  type="text"
                  value={specialMusicos.evento}
                  onChange={(e) =>
                    setSpecialMusicos((prev) => ({
                      ...prev,
                      evento: e.target.value,
                    }))
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
                    setSpecialMusicos((prev) => ({
                      ...prev,
                      data: e.target.value,
                    }))
                  }
                  required
                />
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
                          ? (
                              specialMusicos[
                                key as keyof SpecialSchedule
                              ] as string
                            )
                              ?.split(",")
                              .map((s) => s.trim()) || []
                          : specialMusicos[
                              key as keyof SpecialSchedule
                            ] || ""
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
                  value={specialMusicos.outfitColor || ""}
                  onChange={(e) =>
                    setSpecialMusicos((prev) => ({ ...prev, outfitColor: e.target.value }))
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
                  onClick={handleAddSpecialSchedule}
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

export default EspecialScheduleInput;