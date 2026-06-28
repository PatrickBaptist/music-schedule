import React, { useEffect, useMemo, useState } from "react";
import useUsersContext from "../../context/hooks/useUsersContext";
import { formatDateDDMMYYYY } from "../../helpers/helpers";
import {
  BirthdayAvatar,
  BirthdayCard,
  BirthdayCardContent,
  BirthdayContainer,
  BirthdayDate,
  BirthdayList,
  BirthdayName,
  Title,
} from "./birthdaysMonthStyle";
import LoadingScreen from "../loading/LoadingScreen";

const BirthdaysThisMonth: React.FC = () => {
  const { users, fetchUsers } = useUsersContext();
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await fetchUsers();
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [fetchUsers]);

  const currentMonth = new Date().getMonth() + 1;
  const getInitials = (name?: string, nickname?: string) => {
    const sourceName = (nickname || name || "U").trim();
    return sourceName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  };

  const birthdays = useMemo(() => {
    return users.filter((user) => {
      if (!user.birthDate) return false;
      const month = new Date(user.birthDate).getMonth() + 1;
      return month === currentMonth;
    })
    .sort((a, b) => {
      const dayA = new Date(a.birthDate!).getDate();
      const dayB = new Date(b.birthDate!).getDate();
      return dayA - dayB;
    });
  }, [users, currentMonth]);

  if (birthdays.length === 0) {
    return (
      <div className="container-escala" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h4>Aniversariantes do mês 🎉</h4>
        <p>Nenhum aniversariante este mês.</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ width: '100%', borderTop: '1px solid #444', margin: '55px 0' }} />
      <Title>🎉 Aniversariantes do mês 🎂</Title>

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <BirthdayContainer
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <BirthdayList>
            {birthdays.map((user, index) => (
                <BirthdayCard
                key={user.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
                >
                <BirthdayAvatar aria-label={`Foto de ${user.nickname || user.name}`}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.nickname || user.name || "Foto do aniversariante"} />
                  ) : (
                    <span>{getInitials(user.name, user.nickname)}</span>
                  )}
                </BirthdayAvatar>

                <BirthdayCardContent>
                  <BirthdayName>{user.nickname || user.name}</BirthdayName>
                  <BirthdayDate>{formatDateDDMMYYYY(user.birthDate!)}</BirthdayDate>
                </BirthdayCardContent>
                </BirthdayCard>
            ))}
            </BirthdayList>
        </BirthdayContainer>
      )}
    </>
  );
};

export default BirthdaysThisMonth;
