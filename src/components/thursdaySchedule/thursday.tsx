import { CardThursday, ContainerThursday, MinisterInfo } from "./thursdayStyle";
import { formatDateDDMMYYYY } from "../../helpers/helpers";
import useUsersContext from "../../context/hooks/useUsersContext";
import { useMemo } from "react";
import { UserRole } from "../../types/UserRole";

const ThursdaySchedule = () => {
  const { users } = useUsersContext();

  const ministersFromDb = useMemo(() => {
    return users
      .filter(user => 
        user.roles.includes(UserRole.Minister) &&
        user.status === 'enabled'
      )
      .map(user => user.name);
  }, [users]);

  const getThursdaysOfMonth = (month: number, year: number): Date[] => {
    const thursdays: Date[] = [];
    const date = new Date(year, month - 1, 1);

    while (date.getMonth() === month - 1) {
      if (date.getDay() === 4) {
        thursdays.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }

    return thursdays;
  };

  const assignMinistersToThursdays = (
    month: number,
    year: number
  ): { date: string; minister: string }[] => {
    const thursdays = getThursdaysOfMonth(month, year);
    if (ministersFromDb.length === 0) return [];

    let totalPreviousThursdays = 0;

    for (let m = 1; m < month; m++) {
      totalPreviousThursdays += getThursdaysOfMonth(m, year).length;
    }

    return thursdays.map((thursday, index) => ({
      date: formatDateDDMMYYYY(thursday.toISOString()),
      minister: ministersFromDb[(totalPreviousThursdays + index) % ministersFromDb.length],
    }));
  };

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const schedule = assignMinistersToThursdays(currentMonth, currentYear);

  return (
    <ContainerThursday>
      <div className="content">
          {schedule.map((item, index) => (
            <CardThursday
              key={item.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 120 }}
            >
              <div className="content-escala">
                <p>
                  <strong>Data: </strong>
                  <span style={{ color: '#f59e0b' }}>{item.date}</span>
                </p>
                <p>
                  <strong>Ministro: </strong>
                  <MinisterInfo>
                    {item.minister}
                  </MinisterInfo>
                </p>
              </div>
            </CardThursday>
          ))}
        </div>
    </ContainerThursday>
  );
};

export default ThursdaySchedule;
