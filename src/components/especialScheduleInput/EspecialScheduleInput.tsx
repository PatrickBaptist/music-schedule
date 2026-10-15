import React, { useEffect, useMemo, useState } from "react";
import { createEmptyMusicos, Musicos, normalizeMusicos, SpecialSchedule, SpecialSchedulePayload } from "../../services/ScheduleService";
import { ContainerForm, DarkForm, DarkInput, DarkLabel, FormGroup } from "./EspecialScheduleInputStyle";
import useUsersContext from "../../context/hooks/useUsersContext";
import useSchedulesContext from "../../context/hooks/useScheduleContext";
import { toast } from "sonner";
import MultiMusicianSelect from "../multiMusicianSelect/MultiMusicianSelect";
import Button from "../buttons/Buttons";
import useScheduleRolesContext from "../../context/hooks/useScheduleRolesContext";
import type { ScheduleRoleDefinition } from "../../services/ScheduleRolesService";

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
  address: "",
  description: "",
};

const EspecialScheduleInput: React.FC<EspecialScheduleInputProps> = ({ setIsModalOpen, initialSchedule, initialDate = "" }) => {
  const initialMusicians = useMemo(
    () => initialSchedule ? normalizeMusicos(initialSchedule) : createEmptyMusicos(),
    [initialSchedule]
  );
  const [specialMeta, setSpecialMeta] = useState(() => initialSchedule ? {
    id: initialSchedule.id,
    evento: initialSchedule.evento || "",
    data: initialSchedule.data.slice(0, 10),
    startTime: initialSchedule.startTime || "",
    outfitColor: initialSchedule.outfitColor || initialMusicians.outfitColor || "",
    address: initialSchedule.address || "",
    description: initialSchedule.description || "",
  } : { ...emptyMeta, data: initialDate });
  const [musicosIds, setMusicosIds] = useState<Musicos>(initialMusicians);
  const [assignments, setAssignments] = useState<Record<string, string[]>>(initialSchedule?.assignments ?? {});
  const [roleLabels, setRoleLabels] = useState<Record<string, string>>(initialSchedule?.roleLabels ?? {});
  const [newExtraRoleName, setNewExtraRoleName] = useState("");
  const { users } = useUsersContext();
  const { postSpecialSchedules } = useSchedulesContext();
  const { activeRoles, createRole } = useScheduleRolesContext();
  const displayedRoles = useMemo<ScheduleRoleDefinition[]>(() => [
    ...activeRoles,
    ...Object.entries(roleLabels)
      .filter(([id]) => !activeRoles.some(role => role.id === id))
      .map(([id, name], index) => ({ id, name, active: false, order: 10000 + index })),
  ], [activeRoles, roleLabels]);

  const musiciansBySkill = useMemo(() => Object.fromEntries(activeRoles.map(role => [
    role.id,
    users.filter(user => user.roles?.includes(role.id) && user.status === "enabled")
      .map(user => ({ value: user.id, label: user.nickname?.trim() || user.name?.trim() || user.id })),
  ])), [activeRoles, users]);

  const guestOption = { value: "Convidado", label: "Convidado" };
  const allSingersOption = { value: "Todos cantam", label: "Todos cantam" };

  useEffect(() => {
    if (!initialSchedule || Object.keys(initialSchedule.assignments ?? {}).length > 0 || activeRoles.length === 0) return;
    setAssignments(Object.fromEntries(activeRoles.map(role => [
      role.id,
      role.legacyKey ? [...(initialMusicians[role.legacyKey as keyof Musicos] as string[])] : [],
    ])));
  }, [activeRoles, initialSchedule, initialMusicians]);

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
          address: specialMeta.address,
          description: specialMeta.description,
          músicosIds: {
            ...musicosIds,
            outfitColor: specialMeta.outfitColor,
          },
          assignments,
          roleLabels,
        },
      ],
    };

    setIsModalOpen(false);

    try {
      await postSpecialSchedules(payload);
      toast.success(initialSchedule ? "Escala atualizada!" : "Escala adicionada!", { id: toastId });
      setSpecialMeta(emptyMeta);
      setMusicosIds(createEmptyMusicos());
      setAssignments({});
      setRoleLabels({});
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

              <section className="schedule-roles-section" aria-labelledby="schedule-roles-title">
                <h3 id="schedule-roles-title">Funções da escala</h3>
                <p>Escolha as pessoas responsáveis por cada função.</p>
                {displayedRoles.map((role) => {
                  const isVocal = role.id === "vocal";
                  const options = isVocal
                    ? [...(musiciansBySkill[role.id] ?? []), guestOption, allSingersOption]
                    : [...(musiciansBySkill[role.id] ?? []), guestOption];

                  return (
                    <FormGroup key={role.id}>
                      <MultiMusicianSelect
                        label={role.name}
                        options={options}
                        selected={assignments[role.id] ?? []}
                        onChange={(selected) => {
                          setAssignments(current => ({ ...current, [role.id]: selected }));
                          if (role.legacyKey) setMusicosIds(current => ({ ...current, [role.legacyKey!]: selected }));
                        }}
                        exclusiveValues={isVocal ? [allSingersOption.value] : []}
                      />
                    </FormGroup>
                  );
                })}
              </section>

              <details className="schedule-more-options">
                <summary>Mais opções</summary>
                <div className="schedule-more-options-content">
              <FormGroup>
                <DarkLabel>Adicionar função extra para convidado nesta escala (Opcional):</DarkLabel>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <DarkInput
                    type="text"
                    value={newExtraRoleName}
                    maxLength={60}
                    placeholder="Ex.: Saxofone, Trompete, etc."
                    onChange={event => setNewExtraRoleName(event.target.value)}
                  />
                  {newExtraRoleName.trim() && (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          const name = newExtraRoleName.trim();
                          const id = `extra-${Date.now().toString(36)}`;
                          setRoleLabels(current => ({ ...current, [id]: name }));
                          setAssignments(current => ({ ...current, [id]: [guestOption.value] }));
                          setNewExtraRoleName("");
                        }}
                      >Só nesta escala</Button>
                      <Button
                        onClick={() => void createRole(newExtraRoleName.trim()).then(role => {
                          setAssignments(current => ({ ...current, [role.id]: [guestOption.value] }));
                          setNewExtraRoleName("");
                        }).catch(error => toast.error(error instanceof Error ? error.message : "Erro ao criar função"))}
                      >Salvar no grupo</Button>
                    </>
                  )}
                </div>
              </FormGroup>

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

              <FormGroup>
                <DarkLabel htmlFor="schedule-address">Endereço completo (opcional):</DarkLabel>
                <DarkInput
                  id="schedule-address"
                  type="text"
                  autoComplete="street-address"
                  value={specialMeta.address}
                  onChange={(e) => setSpecialMeta((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Rua, número, bairro, cidade e estado"
                />
              </FormGroup>
              <FormGroup>
                <DarkLabel htmlFor="schedule-description">Descrição (opcional):</DarkLabel>
                <textarea
                  id="schedule-description"
                  value={specialMeta.description}
                  maxLength={1000}
                  onChange={(e) => setSpecialMeta((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Informações importantes sobre esta escala"
                />
              </FormGroup>
                </div>
              </details>
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
