import React, { useMemo, useState } from "react";
import { createEmptyMusicos, Musicos, normalizeMusicos, SpecialSchedule, SpecialSchedulePayload } from "../../services/ScheduleService";
import { ContainerForm, DarkForm, DarkInput, DarkLabel, FormGroup } from "./EspecialScheduleInputStyle";
import useUsersContext from "../../context/hooks/useUsersContext";
import { UserRole } from "../../types/UserRole";
import useSchedulesContext from "../../context/hooks/useScheduleContext";
import { toast } from "sonner";
import MultiMusicianSelect from "../multiMusicianSelect/MultiMusicianSelect";
import Button from "../buttons/Buttons";

type EspecialScheduleInputProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialSchedule?: SpecialSchedule | null;
  initialDate?: string;
};

const emptyMeta = {
  id: "",
  evento: "",
  data: "",
  startTime: "",
  outfitColor: "",
};

const EspecialScheduleInput: React.FC<EspecialScheduleInputProps> = ({ setIsModalOpen, initialSchedule, initialDate = "" }) => {
  const initialMusicians = initialSchedule ? normalizeMusicos(initialSchedule) : createEmptyMusicos();
  const [specialMeta, setSpecialMeta] = useState(() => initialSchedule ? {
    id: initialSchedule.id,
    evento: initialSchedule.evento || "",
    data: initialSchedule.data.slice(0, 10),
    startTime: initialSchedule.startTime || "",
    outfitColor: initialSchedule.outfitColor || initialMusicians.outfitColor || "",
  } : { ...emptyMeta, data: initialDate });
  const [musicosIds, setMusicosIds] = useState<Musicos>(initialMusicians);
  const { users } = useUsersContext();
  const { postSpecialSchedules } = useSchedulesContext();

  const musiciansBySkill = useMemo(() => {
    const byRole = (role: UserRole) =>
      users
        .filter((u) => u.roles?.includes(role) && u.status === "enabled")
        .map((u) => ({ value: u.id, label: u.nickname?.trim() || u.name?.trim() || u.id }));

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

  const guestOption = { value: "Convidado", label: "Convidado" };
  const allSingersOption = { value: "Todos cantam", label: "Todos cantam" };

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

  const handleAddSpecialSchedule = async () => {
    if (!specialMeta.data) {
      toast.error("A data é obrigatória!");
      return;
    }

    const toastId = toast.loading("Aguarde...");
    const payload: { schedules: SpecialSchedulePayload[] } = {
      schedules: [
        {
          id: specialMeta.id || undefined,
          evento: specialMeta.evento.trim(),
          data: specialMeta.data,
          startTime: specialMeta.startTime || null,
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
      toast.success(initialSchedule ? "Escala atualizada!" : "Escala adicionada!", { id: toastId });
      setSpecialMeta(emptyMeta);
      setMusicosIds(createEmptyMusicos());
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar escala", { id: toastId });
    }
  };

  return (
    <ContainerForm>
      <div className="form-column">
        <div className="form-container">
          <h2>{initialSchedule ? 'Editar escala' : 'Nova escala'}</h2>
          <div className="form-content">
            <DarkForm>
              <FormGroup>
                <DarkLabel>Nome do evento (opcional):</DarkLabel>
                <DarkInput
                  type="text"
                  value={specialMeta.evento}
                  onChange={(e) =>
                    setSpecialMeta((prev) => ({
                      ...prev,
                      evento: e.target.value,
                    }))
                  }
                  placeholder="Ex.: Culto, ensaio ou conferência"
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

              <FormGroup>
                <DarkLabel>Horário (opcional):</DarkLabel>
                <DarkInput
                  type="time"
                  value={specialMeta.startTime}
                  onChange={(e) => setSpecialMeta((prev) => ({ ...prev, startTime: e.target.value }))}
                />
              </FormGroup>

              {ordemCampos.map((key: Campo) => {
                const isVocal = key === "vocal";
                const options = isVocal
                  ? [...musiciansBySkill.vocal, guestOption, allSingersOption]
                  : [...musiciansBySkill[key], guestOption];

                return (
                  <FormGroup key={key}>
                    <MultiMusicianSelect
                      label={labels[key] || key}
                      options={options}
                      selected={musicosIds[key]}
                      onChange={(selected) =>
                        setMusicosIds((prev) => ({ ...prev, [key]: selected }))
                      }
                      exclusiveValues={isVocal ? [allSingersOption.value] : []}
                    />
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
                <Button
                  variant="secondary"
                  onClick={setIsModalOpen.bind(null, false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddSpecialSchedule}>
                  Salvar Escala
                </Button>
              </div>
            </DarkForm>
          </div>
        </div>
      </div>
    </ContainerForm>
  );
};

export default EspecialScheduleInput;
