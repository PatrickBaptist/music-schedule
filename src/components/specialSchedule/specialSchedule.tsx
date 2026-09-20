import React, { useMemo } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { ContainerEscala } from "./specialScheduleStyle";
import LoadingScreen from "../loading/LoadingScreen";
import useUsersContext from "../../context/hooks/useUsersContext";
import type { User } from "../../services/UsersService";
import type { SpecialSchedule } from "../../services/ScheduleService";
import SpecialScheduleCard from "./SpecialScheduleCard";

interface SpecialSchedulesProps {
  schedules: SpecialSchedule[];
  loading?: boolean;
}

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
          schedules
            .slice()
            .sort((a, b) => a.data.localeCompare(b.data) || (a.startTime || "99:99").localeCompare(b.startTime || "99:99"))
            .map((schedule, index) => (
              <SpecialScheduleCard
                key={schedule.id || index}
                schedule={schedule}
                usersById={usersById}
              />
            ))
        ) : (
          <div className="empty-schedule">
            <FaCalendarAlt aria-hidden="true" />
            <strong>Nenhuma escala nesta semana</strong>
            <span>Quando uma escala for criada, ela aparecerá aqui.</span>
          </div>
        )}
      </div>
    </ContainerEscala>
  );
};

export default SpecialSchedules;
