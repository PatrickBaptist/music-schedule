import React, { useEffect, useMemo, useState } from "react";
import { createEmptyMusicos, Musicos, normalizeMusicos, SpecialSchedulePayload } from "../../services/ScheduleService";
import { ContainerForm, DarkButton, DarkButtonCancel, DarkForm, DarkInput, DarkLabel, DarkSelect, FormGroup } from "./EspecialScheduleInputStyle";
import useUsersContext from "../../context/hooks/useUsersContext";
import { UserRole } from "../../types/UserRole";
import useSchedulesContext from "../../context/hooks/useScheduleContext";
import { toast } from "sonner";

type EspecialScheduleInputProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const emptyMeta = {
  id: "",
  evento: "",
  data: "",
  outfitColor: "",
};

const EspecialScheduleInput: React.FC<EspecialScheduleInputProps> = ({ setIsModalOpen }) => {
  const [specialMeta, setSpecialMeta] = useState(emptyMeta);
  const [musicosIds, setMusicosIds] = useState<Musicos>(createEmptyMusicos());
  const { users } = useUsersContext();
  const { postSpecialSchedules, getSpecialSchedules, specialSchedules } = useSchedulesContext();

  const getUserLabel = (user: (typeof users)[number]) => user.nickname?.trim() || user.name?.trim() || user.id;

  const resolveUserId = (value?: string) => {
    if (!value) return "";

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

  useEffect(() => {
    getSpecialSchedules();
  }, [getSpecialSchedules]);

  useEffect(() => {
    if (!specialMeta.data || !specialSchedules) return;

    const found = specialSchedules.find(
      (schedule) => schedule.data.slice(0, 10) === specialMeta.data.slice(0, 10)
    );

    if (!found) {
      setMusicosIds(createEmptyMusicos());
      return;
    }

    const normalized = normalizeMusicos(found.músicosIds ?? found.músicos ?? found);
    setSpecialMeta({
      id: found.id || "",
      evento: found.evento || "",
      data: found.data?.slice(0, 10) || specialMeta.data,
      outfitColor: found.outfitColor || normalized.outfitColor || "",
    });
    setMusicosIds({
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
  }, [specialMeta.data, specialSchedules, users]);

  const handleAddSpecialSchedule = async () => {
    if (!specialMeta.evento || !specialMeta.data) {
      toast.error("Evento e data obrigatórios!");
      return;
    }

    const toastId = toast.loading("Aguarde...");
    const payload: { schedules: SpecialSchedulePayload[] } = {
      schedules: [
        {
          id: specialMeta.id || undefined,
          evento: specialMeta.evento,
          data: specialMeta.data,
          outfitColor: specialMeta.outfitColor,
          músicosIds: {
            ...musicosIds,
            outfitColor: specialMeta.outfitColor,
          },
        },
      ],
    };

    setIsModalOpen(false);

    try {
      await postSpecialSchedules(payload);
      toast.success("Escala especial adicionada!", { id: toastId });
      setSpecialMeta(emptyMeta);
      setMusicosIds(createEmptyMusicos());
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar escala especial", { id: toastId });
    }
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
                  value={specialMeta.evento}
                  onChange={(e) =>
                    setSpecialMeta((prev) => ({
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
                  value={specialMeta.data}
                  onChange={(e) =>
                    setSpecialMeta((prev) => ({
                      ...prev,
                      data: e.target.value,
                    }))
                  }
                  required
                />
              </FormGroup>

              {ordemCampos.map((key: Campo) => {
                const isVocal = key === "vocal";
                const options = musiciansBySkill[isVocal ? "vocal" : key];

                return (
                  <FormGroup key={key}>
                    <DarkLabel>{labels[key] || key}:</DarkLabel>
                    <DarkSelect
                      multiple={isVocal}
                      value={isVocal ? musicosIds.vocal : musicosIds[key] || ""}
                      onChange={(e) => {
                        if (isVocal) {
                          const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
                          setMusicosIds((prev) => ({
                            ...prev,
                            vocal: selected,
                          }));
                          return;
                        }

                        setMusicosIds((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }));
                      }}
                    >
                      {!isVocal && <option value="">Selecione</option>}
                      {options.map((musico) => (
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
                  value={specialMeta.outfitColor}
                  onChange={(e) =>
                    setSpecialMeta((prev) => ({ ...prev, outfitColor: e.target.value }))
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
