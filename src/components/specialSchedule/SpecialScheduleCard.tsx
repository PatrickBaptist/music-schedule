import { FaCalendarAlt, FaClock, FaPalette } from "react-icons/fa";
import { formatDateDDMMYYYY } from "../../helpers/helpers";
import type { SpecialSchedule } from "../../services/ScheduleService";
import type { User } from "../../services/UsersService";
import ScheduledPerson, { type PersonRef } from "../scheduledPerson/ScheduledPerson";
import { ScheduleCard } from "./SpecialScheduleCardStyle";

interface SpecialScheduleCardProps {
  schedule: SpecialSchedule;
  usersById: Record<string, User>;
}

const firstAvailablePeople = (...values: Array<PersonRef[] | PersonRef>) => {
  for (const value of values) {
    const list = Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];
    if (list.length > 0) return list;
  }
  return [];
};

const formatScheduleDate = (value: string) => {
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  const formattedDate = formatDateDDMMYYYY(value);

  if (Number.isNaN(date.getTime())) return formattedDate;

  const weekday = date
    .toLocaleDateString("pt-BR", { weekday: "short" })
    .replace(".", "");

  return `${weekday}, ${formattedDate}`;
};

const SpecialScheduleCard = ({ schedule, usersById }: SpecialScheduleCardProps) => {
  const roles = [
    {
      label: "Ministro",
      people: firstAvailablePeople(schedule.músicosIds?.minister, schedule.músicos?.minister, schedule.minister),
      highlighted: true,
    },
    {
      label: "Vocal",
      people: firstAvailablePeople(schedule.músicosIds?.vocal, schedule.músicos?.vocal, [schedule.vocal1, schedule.vocal2]),
    },
    { label: "Teclas", people: firstAvailablePeople(schedule.músicosIds?.teclas, schedule.músicos?.teclas, schedule.teclas) },
    { label: "Violão", people: firstAvailablePeople(schedule.músicosIds?.violao, schedule.músicos?.violao, schedule.violao) },
    { label: "Bateria", people: firstAvailablePeople(schedule.músicosIds?.batera, schedule.músicos?.batera, schedule.batera) },
    { label: "Baixo", people: firstAvailablePeople(schedule.músicosIds?.bass, schedule.músicos?.bass, schedule.bass) },
    { label: "Guitarra", people: firstAvailablePeople(schedule.músicosIds?.guita, schedule.músicos?.guita, schedule.guita) },
    { label: "Operador de som", people: firstAvailablePeople(schedule.músicosIds?.sound, schedule.músicos?.sound, schedule.sound) },
  ];
  const outfitColor = schedule.outfitColor
    || schedule.músicosIds?.outfitColor
    || schedule.musicosIds?.outfitColor
    || schedule.músicos?.outfitColor
    || schedule.musicos?.outfitColor;

  return (
    <ScheduleCard>
      <header className="schedule-card-header">
        {schedule.evento?.trim() && <h5>{schedule.evento.trim()}</h5>}
        <div className="schedule-meta">
          <span><FaCalendarAlt aria-hidden="true" /> {formatScheduleDate(schedule.data)}</span>
          <span><FaClock aria-hidden="true" /> {schedule.startTime || "Horário a definir"}</span>
        </div>
      </header>

      <div className="schedule-roles">
        {roles.map((role) => (
          <div
            key={role.label}
            className={`schedule-role${role.highlighted ? " is-highlighted" : ""}`}
          >
            <strong>{role.label}</strong>
            <div className="schedule-role-value">
              {role.people.length > 0 ? (
                <ScheduledPerson people={role.people} usersById={usersById} />
              ) : (
                <span className="vacant-role">A definir</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <footer className="outfit-card">
        <FaPalette aria-hidden="true" />
        <div>
          <span>Paleta de cores</span>
          <strong className={!outfitColor ? "is-empty" : undefined}>
            {outfitColor || "A definir"}
          </strong>
        </div>
      </footer>
    </ScheduleCard>
  );
};

export default SpecialScheduleCard;
