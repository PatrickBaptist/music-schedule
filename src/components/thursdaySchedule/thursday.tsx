import React from "react";
import { CardThursday, ContainerThursday, MinisterInfo } from "./thursdayStayle";
import { formatDateDDMMYYYY } from "../../helpers/helpers";

const vocals = ["Anna", "Anderson", "Taisa", "Sarah"];

const ThursdaySchedule: React.FC = () => {
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

    return thursdays.map((thursday, index) => ({
      date: formatDateDDMMYYYY(thursday.toISOString()),
      minister: vocals[index % vocals.length],
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
              whileHover={{ scale: 1.02 }}
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
