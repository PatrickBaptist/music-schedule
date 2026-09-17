import React, { useMemo } from "react";
import { ContainerEscala } from "./specialScheduleStyle";
import { formatDateDDMMYYYY } from "../../helpers/helpers";
import LoadingScreen from "../loading/LoadingScreen";
import useUsersContext from "../../context/hooks/useUsersContext";
import type { User } from "../../services/UsersService";
import { SpecialSchedule } from "../../services/ScheduleService";
import ScheduledPerson, { PersonRef } from "../scheduledPerson/ScheduledPerson";

interface SpecialSchedulesProps {
  schedules: SpecialSchedule[];
  loading?: boolean;
}

const PersonList = ({
  people,
  usersById,
}: {
  people: PersonRef[] | PersonRef;
  usersById: Record<string, User>;
}) => {
  return <ScheduledPerson people={people} usersById={usersById} />;
};

const firstAvailablePeople = (...values: Array<PersonRef[] | PersonRef>) => {
  for (const value of values) {
    const list = Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];
    if (list.length > 0) return list;
  }
  return [];
};

const SpecialSchedules: React.FC<SpecialSchedulesProps> = ({ schedules, loading }) => {
  const { users } = useUsersContext();
  const usersById = useMemo(
    () => users.reduce<Record<string, User>>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {}),
    [users]
  );

  return (
    <ContainerEscala>
      <div className="escala-content">
        {loading ? (
          <LoadingScreen />
        ) : schedules.length > 0 ? (
          schedules.slice().sort((a, b) => a.data.localeCompare(b.data) || (a.startTime || '99:99').localeCompare(b.startTime || '99:99')).map((escala, index) => (
            <div key={escala.id || index} className="escala-content-escala">
              <p><strong>Evento:</strong> {escala.evento}</p>
              <p><strong>Data:</strong> {formatDateDDMMYYYY(escala.data)}</p>
              <p><strong>Horário:</strong> {escala.startTime || 'Não definido'}</p>
              <p style={{ fontWeight: 'bold', color: '#f59e0b' }}>
                <strong>Ministro:</strong>
                <PersonList people={firstAvailablePeople(escala.músicosIds?.minister, escala.músicos?.minister, escala.minister)} usersById={usersById} />
              </p>
              <p>
                <strong>Vocal:</strong>
                <PersonList
                  people={firstAvailablePeople(escala.músicosIds?.vocal, escala.músicos?.vocal, [escala.vocal1, escala.vocal2])}
                  usersById={usersById}
                />
              </p>
              <p><strong>Teclas:</strong> <PersonList people={firstAvailablePeople(escala.músicosIds?.teclas, escala.músicos?.teclas, escala.teclas)} usersById={usersById} /></p>
              <p><strong>Violão:</strong> <PersonList people={firstAvailablePeople(escala.músicosIds?.violao, escala.músicos?.violao, escala.violao)} usersById={usersById} /></p>
              <p><strong>Batera:</strong> <PersonList people={firstAvailablePeople(escala.músicosIds?.batera, escala.músicos?.batera, escala.batera)} usersById={usersById} /></p>
              <p><strong>Bass:</strong> <PersonList people={firstAvailablePeople(escala.músicosIds?.bass, escala.músicos?.bass, escala.bass)} usersById={usersById} /></p>
              <p><strong>Guita:</strong> <PersonList people={firstAvailablePeople(escala.músicosIds?.guita, escala.músicos?.guita, escala.guita)} usersById={usersById} /></p>
              <p><strong>Op. som: </strong><PersonList people={firstAvailablePeople(escala.músicosIds?.sound, escala.músicos?.sound, escala.sound)} usersById={usersById} /></p>
              <p><strong>Paleta de cores:</strong> <span style={{ fontStyle: 'italic' }}>{escala.outfitColor || escala.músicosIds?.outfitColor || escala.músicos?.outfitColor || "Não definido"}</span></p>
            </div>
          ))
        ) : (
          <p>Não há escalas nesta semana</p>
        )}
      </div>
    </ContainerEscala>
  );
};

export default SpecialSchedules;
