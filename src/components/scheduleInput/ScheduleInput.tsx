import React, { useEffect, useMemo, useState } from "react";
import { createEmptyMusicos, Musicos, normalizeMusicos } from "../../services/ScheduleService";
import { ContainerForm, DarkButton, DarkButtonCancel, DarkForm, DarkInput, DarkLabel, DarkSelect, FormGroup } from "./ScheduleInputStyle";
import useUsersContext from "../../context/hooks/useUsersContext";
import { UserRole } from "../../types/UserRole";
import useSchedulesContext from "../../context/hooks/useScheduleContext";
import { toast } from "sonner";

type ScheduleInputProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ScheduleInput: React.FC<ScheduleInputProps> = ({ setIsModalOpen }) => {
  const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, "0"));
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [date, setDate] = useState("");
  const [músicos, setMúsicos] = useState<Musicos>(createEmptyMusicos());
  const [sundays, setSundays] = useState<Date[]>([]);
  const [, setIsLoading] = useState<boolean>(true);
  const { users } = useUsersContext();

  const getUserLabel = (user: (typeof users)[number]) => user.nickname?.trim() || user.name?.trim() || user.id;
  const resolveUserId = (value?: string) => {
    if (!value) return '';

    const direct = users.find((user) => user.id === value);
    if (direct) return direct.id;

    const byLabel = users.find(
      (user) =>
        user.nickname?.trim() === value ||
        user.name?.trim() === value
    );

    return byLabel?.id || value;
  };

  const musiciansBySkill = useMemo(() => {
    const byRole = (role: UserRole) =>
      users
        .filter((u) => u.roles?.includes(role) && u.status === "enabled")
        .map((u) => ({ value: u.id, label: getUserLabel(u) }));

    return {
      minister: byRole(UserRole.Minister),
      vocal: byRole(UserRole.Vocal),
      teclas: byRole(UserRole.Keyboard),
      violao: byRole(UserRole.Violao),
      bass: byRole(UserRole.Bass),
      guita: byRole(UserRole.Guitar),
      batera: byRole(UserRole.Drums),
      sound: byRole(UserRole.Sound),
    };
  }, [users]);

  const labels: Record<string, string> = {
    minister: "Ministro",
    teclas: "Teclado",
    violao: "Violão",
    batera: "Bateria",
    bass: "Baixo",
    guita: "Guitarra",
    sound: "Op. Som",
    vocal: "Vocal",
  };

  const ordemCampos = [
    "minister",
    "teclas",
    "violao",
    "batera",
    "bass",
    "guita",
    "sound",
    "vocal",
  ] as const;

  type Campo = (typeof ordemCampos)[number];

  const { saveOrUpdateSchedule, getScheduleForMonth, monthlySchedule } = useSchedulesContext();

  useEffect(() => {
    const sundaysList = getSundaysOfMonth(parseInt(month, 10), year);
    setSundays(sundaysList);
  }, [month, year]);

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

  useEffect(() => {
    if (!date || !monthlySchedule) return;

    setIsLoading(true);

    const found = monthlySchedule.find((s) => s.date.slice(0, 10) === date.slice(0, 10));
    if (found) {
      const normalized = normalizeMusicos(found.músicosIds ?? found.músicos);
      setMúsicos({
        ...normalized,
        minister: resolveUserId(normalized.minister),
        vocal: normalized.vocal.map(resolveUserId),
        teclas: resolveUserId(normalized.teclas),
        violao: resolveUserId(normalized.violao),
        batera: resolveUserId(normalized.batera),
        bass: resolveUserId(normalized.bass),
        guita: resolveUserId(normalized.guita),
        sound: resolveUserId(normalized.sound),
      });
    }
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

  const handleSubmit = async () => {
    const toastId = toast.loading("Aguarde...");

    const payload = {
      month,
      year,
      date,
      músicosIds: músicos,
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
                  onChange={(e) => setYear(parseInt(e.target.value, 10))}
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

              {ordemCampos.map((key: Campo) => {
                const isVocal = key === "vocal";
                const options = musiciansBySkill[isVocal ? "vocal" : key];

                return (
                  <FormGroup key={key}>
                    <DarkLabel>{labels[key] || key}:</DarkLabel>
                    <DarkSelect
                      multiple={isVocal}
                      value={isVocal ? músicos.vocal : músicos[key] || ""}
                      onChange={(e) => {
                        if (isVocal) {
                          const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
                          setMúsicos((prev) => ({
                            ...prev,
                            vocal: selected,
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
                      {options.map((musico: { value: string; label: string }) => (
                        <option key={musico.value} value={musico.value}>
                          {musico.label}
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
                  onChange={(e) => setMúsicos((prev) => ({ ...prev, outfitColor: e.target.value }))}
                  placeholder="Ex.: Preto e branco"
                />
              </FormGroup>
            </DarkForm>
          </div>

          <div className="button-container">
            <DarkButtonCancel type="button" onClick={setIsModalOpen.bind(null, false)}>
              Cancelar
            </DarkButtonCancel>
            <DarkButton type="button" onClick={handleSubmit}>
              Salvar Escala
            </DarkButton>
          </div>
        </div>
      </div>
    </ContainerForm>
  );
};

export default ScheduleInput;
