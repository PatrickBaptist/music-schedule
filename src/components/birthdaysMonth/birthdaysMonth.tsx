import React, { useEffect, useMemo, useState } from "react";
import { FaBirthdayCake, FaGift, FaStar } from "react-icons/fa";
import useUsersContext from "../../context/hooks/useUsersContext";
import {
  BirthdayAvatar,
  BirthdayCard,
  BirthdayCelebration,
  BirthdayDate,
  BirthdayEmptyState,
  BirthdayList,
  BirthdayName,
  CelebrationHeader,
  FeaturedBirthday,
  FeaturedBirthdayAvatar,
  FeaturedBirthdayContent,
  PartyStage,
} from "./birthdaysMonthStyle";
import LoadingScreen from "../loading/LoadingScreen";

const getBirthDateParts = (value: string) => {
  const [, month, day] = value.slice(0, 10).split("-").map(Number);
  return { month, day };
};

const getBirthdayLabel = (value: string) => {
  const { month, day } = getBirthDateParts(value);
  return new Date(2000, month - 1, day).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
};

const getInitials = (name?: string, nickname?: string) => {
  const sourceName = (nickname || name || "U").trim();
  return sourceName.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
};

const BirthdaysThisMonth: React.FC = () => {
  const { users, fetchUsers } = useUsersContext();
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

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

  const birthdays = useMemo(() => users
    .filter((user) => user.birthDate && getBirthDateParts(user.birthDate).month === currentMonth)
    .sort((a, b) => getBirthDateParts(a.birthDate!).day - getBirthDateParts(b.birthDate!).day),
  [currentMonth, users]);

  const featuredBirthday = birthdays.find((user) => getBirthDateParts(user.birthDate!).day >= currentDay)
    || birthdays[birthdays.length - 1];
  const otherBirthdays = birthdays.filter((user) => user.id !== featuredBirthday?.id);

  const getRelativeBirthday = (birthDate: string) => {
    const { month, day } = getBirthDateParts(birthDate);
    const birthday = new Date(today.getFullYear(), month - 1, day);
    birthday.setHours(0, 0, 0, 0);
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    const difference = Math.round((birthday.getTime() - startOfToday.getTime()) / 86_400_000);

    if (difference === 0) return "É hoje! 🎉";
    if (difference === 1) return "É amanhã";
    if (difference > 1) return `Faltam ${difference} dias`;
    return "Já comemoramos neste mês";
  };

  if (isLoading) return <LoadingScreen />;

  if (!featuredBirthday) {
    return (
      <BirthdayEmptyState>
        <FaBirthdayCake aria-hidden="true" />
        <div><strong>Aniversariantes do mês</strong><span>Nenhum aniversário cadastrado neste mês.</span></div>
      </BirthdayEmptyState>
    );
  }

  return (
    <BirthdayCelebration initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <CelebrationHeader>
        <div>
          <span>É tempo de celebrar</span>
          <h2>Aniversariantes do mês</h2>
          <p>Um cantinho especial para comemorar quem faz parte da nossa equipe.</p>
        </div>
        <FaBirthdayCake aria-hidden="true" />
      </CelebrationHeader>

      <PartyStage>
        <span className="balloon balloon-one" aria-hidden="true" />
        <span className="balloon balloon-two" aria-hidden="true" />
        <span className="confetti confetti-one" aria-hidden="true" />
        <span className="confetti confetti-two" aria-hidden="true" />
        <span className="confetti confetti-three" aria-hidden="true" />

        <FeaturedBirthday>
          <FeaturedBirthdayAvatar aria-label={`Foto de ${featuredBirthday.nickname || featuredBirthday.name}`}>
            {featuredBirthday.photoURL ? (
              <img src={featuredBirthday.photoURL} alt={featuredBirthday.nickname || featuredBirthday.name || "Foto do aniversariante"} />
            ) : (
              <span>{getInitials(featuredBirthday.name, featuredBirthday.nickname)}</span>
            )}
            <FaStar className="birthday-star" aria-hidden="true" />
          </FeaturedBirthdayAvatar>
          <FeaturedBirthdayContent>
            <span className="featured-label">Aniversariante em destaque</span>
            <h3>{featuredBirthday.nickname || featuredBirthday.name}</h3>
            <strong>{getBirthdayLabel(featuredBirthday.birthDate!)}</strong>
            <small>{getRelativeBirthday(featuredBirthday.birthDate!)}</small>
          </FeaturedBirthdayContent>
        </FeaturedBirthday>
      </PartyStage>

      {otherBirthdays.length > 0 && (
        <BirthdayList>
          <div className="birthday-list-heading">
            <div><FaGift aria-hidden="true" /><strong>Também celebramos</strong></div>
            <span>{otherBirthdays.length} {otherBirthdays.length === 1 ? "pessoa" : "pessoas"}</span>
          </div>
          <div className="birthday-list-grid">
            {otherBirthdays.map((user, index) => (
              <BirthdayCard key={user.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.06 }}>
                <BirthdayAvatar aria-label={`Foto de ${user.nickname || user.name}`}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.nickname || user.name || "Foto do aniversariante"} />
                  ) : (
                    <span>{getInitials(user.name, user.nickname)}</span>
                  )}
                </BirthdayAvatar>
                <div>
                  <BirthdayName>{user.nickname || user.name}</BirthdayName>
                  <BirthdayDate>{getBirthdayLabel(user.birthDate!)}</BirthdayDate>
                </div>
              </BirthdayCard>
            ))}
          </div>
        </BirthdayList>
      )}
    </BirthdayCelebration>
  );
};

export default BirthdaysThisMonth;
