import React from "react";
import { CardThursday, ContainerThursday, MinisterInfo } from "./thursdayStayle";
import { formatDateDDMMYYYY } from "../../helpers/helpers";
import { motion } from "motion/react";

const vocals = ["🎤 Anna", "🎤 Anderson", "🎤 Taisa", "🎤 Sarah"];

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
      {schedule.map((item, index) => (
        <CardThursday
            key={item.date}
            initial={{ opacity: 0, y: 20, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: index * 0.15, type: "spring", stiffness: 120 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
        >
          <span className="date">{item.date}</span>
          <MinisterInfo
            as={motion.div}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: index * 0.3 }}
        >
            <span>{item.minister}</span>
          </MinisterInfo>
        </CardThursday>
      ))}
    </ContainerThursday>
  );
};

export default ThursdaySchedule;
