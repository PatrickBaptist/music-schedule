import { FaCalendarAlt, FaClock, FaPalette, FaMapMarkerAlt } from "react-icons/fa";
import { formatDateDDMMYYYY } from "../../helpers/helpers";
import type { SpecialSchedule } from "../../services/ScheduleService";
import type { User } from "../../services/UsersService";
import ScheduledPerson, { type PersonRef } from "../scheduledPerson/ScheduledPerson";
import { ScheduleCard } from "./SpecialScheduleCardStyle";
import useScheduleRolesContext from "../../context/hooks/useScheduleRolesContext";

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
  const { roles: roleDefinitions } = useScheduleRolesContext();
  const roleIds = [...new Set([...roleDefinitions.map(role => role.id), ...Object.keys(schedule.assignments ?? {})])];
  const roles = roleIds.map(roleId => {
    const definition = roleDefinitions.find(role => role.id === roleId);
    const legacyKey = definition?.legacyKey || undefined;
    const idValues = schedule.músicosIds as unknown as Record<string, PersonRef[]> | undefined;
    const detailValues = schedule.músicos as unknown as Record<string, PersonRef[]> | undefined;
    const legacyPeople = legacyKey ? firstAvailablePeople(
      idValues?.[legacyKey],
      detailValues?.[legacyKey],
    ) : [];
    return {
      label: definition?.name || schedule.roleLabels?.[roleId] || roleId,
      people: firstAvailablePeople(schedule.assignments?.[roleId], legacyPeople),
      highlighted: roleId === "minister",
    };
  }).filter(role => role.people.length > 0);
  const outfitColor = schedule.outfitColor
    || schedule.músicosIds?.outfitColor
    || schedule.musicosIds?.outfitColor
    || schedule.músicos?.outfitColor
    || schedule.musicos?.outfitColor;
  const address = schedule.address?.trim();
  const mapsUrl = address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : "";
  const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY;
  const mapEmbedUrl = address && mapsKey
    ? `https://www.google.com/maps/embed/v1/search?key=${encodeURIComponent(mapsKey)}&q=${encodeURIComponent(address)}`
    : "";

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

      {(address || schedule.description?.trim()) && (
        <section className="schedule-extra-info" aria-label="Informações adicionais da escala">
          {schedule.description?.trim() && <p className="schedule-description">{schedule.description.trim()}</p>}
          {address && (
            <div className="schedule-location">
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="schedule-address">
                <FaMapMarkerAlt aria-hidden="true" /> {address}
              </a>
              {mapEmbedUrl && <iframe src={mapEmbedUrl} title={`Mapa de ${address}`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />}
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="schedule-map-link">Abrir no Google Maps</a>
            </div>
          )}
        </section>
      )}
    </ScheduleCard>
  );
};

export default SpecialScheduleCard;
