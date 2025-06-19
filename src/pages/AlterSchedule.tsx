import React, { useEffect, useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  DarkForm,
  DarkInput,
  DarkLabel,
  DarkTitle,
  DarkWrapper,
  DarkSelect,
  DarkButton,
  FormGroup,
} from "./pageStyle/AlterSchedule";
import { useNavigate } from "react-router-dom";

interface Schedule {
  date: string;
  músicos: {
    teclas: string;
    batera: string;
    bass: string;
    guita: string;
    vocal1: string;
    vocal2: string;
  };
}

const ScheduleForm: React.FC = () => {
  const [DarkSelectedMonth, setDarkSelectedMonth] = useState<string>("01"); // Mês inicial
  const [DarkSelectedYear, setDarkSelectedYear] = useState<number>(new Date().getFullYear()); // Ano atual
  const [date, setDate] = useState("");
  const [teclas, setTeclas] = useState("");
  const [batera, setBatera] = useState("");
  const [bass, setBass] = useState("");
  const [guita, setGuita] = useState("");
  const [vocal1, setVocal1] = useState("");
  const [vocal2, setVocal2] = useState("");
  const [sundays, setSundays] = useState<Date[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const sundaysList = getSundaysOfMonth(
      parseInt(DarkSelectedMonth),
      DarkSelectedYear
    );
    setSundays(sundaysList);
  }, [DarkSelectedMonth, DarkSelectedYear]);

  const getSundaysOfMonth = (month: number, year: number): Date[] => {
    const date = new Date(year, month - 1, 1);
    const sundays: Date[] = [];

    while (date.getMonth() === month - 1) {
      if (date.getDay() === 0) {
        sundays.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }

    return sundays;
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!date) return;

      const monthYear = `${DarkSelectedMonth}-${DarkSelectedYear}`;
      const docRef = doc(db, "schedules", monthYear);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const formatDate = (d: string) => new Date(d).toISOString().slice(0, 10);
        const foundSchedule = existingData.sundays?.find(
          (s: Schedule) => formatDate(s.date) === formatDate(date)
        );

        if (foundSchedule) {
          setTeclas(foundSchedule.músicos.teclas);
          setBatera(foundSchedule.músicos.batera);
          setBass(foundSchedule.músicos.bass);
          setGuita(foundSchedule.músicos.guita);
          setVocal1(foundSchedule.músicos.vocal1);
          setVocal2(foundSchedule.músicos.vocal2);
        } else {
          setTeclas("");
          setBatera("");
          setBass("");
          setGuita("");
          setVocal1("");
          setVocal2("");
        }
      }
    };

    fetchSchedule();
  }, [date, DarkSelectedMonth, DarkSelectedYear]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const monthYear = `${DarkSelectedMonth}-${DarkSelectedYear}`;

    try {
      // Verifica se o documento já existe
      const docRef = doc(db, "schedules", monthYear);
      const docSnap = await getDoc(docRef);

      // Se o documento já existe, atualiza a escala do domingo selecionado
      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const updatedSundays: Schedule[] = existingData.sundays || [];

        // Substitui ou adiciona a escala para o domingo
        const sundayIndex = updatedSundays.findIndex(
          (s: Schedule) => s.date === date
        );

        if (sundayIndex >= 0) {
          updatedSundays[sundayIndex] = {
            date,
            músicos: { teclas, batera, bass, guita, vocal1, vocal2 },
          };
        } else {
          updatedSundays.push({
            date,
            músicos: { teclas, batera, bass, guita, vocal1, vocal2 },
          });
        }

        // Atualiza o documento no Firestore
        await setDoc(docRef, { sundays: updatedSundays });
      } else {
        // Se o documento não existir, cria um novo com os domingos e a escala
        await setDoc(docRef, {
          sundays: [
            { date, músicos: { teclas, batera, bass, guita, vocal1, vocal2 } },
          ],
        });
      }

      alert("Escala salva com sucesso!");
      // Limpar campos após o envio
      setDate("");
      setTeclas("");
      setBatera("");
      setBass("");
      setGuita("");
      setVocal1("");
      setVocal2("");
    } catch (error) {
      alert("Erro ao salvar a escala!");
    }
  };

  return (
    <DarkWrapper>
      <DarkTitle>Preencher Escala do Mês</DarkTitle>
      <DarkForm onSubmit={handleSubmit}>
        <FormGroup style={{ display: "flex", justifyContent: "space-between" }}>
          <DarkLabel>Mês:</DarkLabel>
          <DarkSelect
            value={DarkSelectedMonth}
            onChange={(e) => setDarkSelectedMonth(e.target.value)}
            required
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option
                key={index}
                value={(index + 1).toString().padStart(2, "0")}
              >
                {new Date(0, index).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </DarkSelect>
        </FormGroup>
        <FormGroup>
          <DarkLabel>Ano:</DarkLabel>
          <DarkInput
            type="number"
            value={DarkSelectedYear}
            onChange={(e) => setDarkSelectedYear(parseInt(e.target.value))}
            min={2000}
            required
          />
        </FormGroup>
        <FormGroup>
          <DarkLabel>Data (Domingo):</DarkLabel>
          <DarkSelect
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          >
            <option value="">Selecione um domingo</option>
            {sundays.map((sunday, index) => (
              <option key={index} value={sunday.toISOString()}>
                {sunday.toLocaleDateString()}
              </option>
            ))}
          </DarkSelect>
        </FormGroup>
        <FormGroup>
          <DarkLabel>Teclas:</DarkLabel>
          <DarkInput
            type="text"
            value={teclas}
            onChange={(e) => setTeclas(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <DarkLabel>Batera:</DarkLabel>
          <DarkInput
            type="text"
            value={batera}
            onChange={(e) => setBatera(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <DarkLabel>Bass:</DarkLabel>
          <DarkInput
            type="text"
            value={bass}
            onChange={(e) => setBass(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <DarkLabel>Guita:</DarkLabel>
          <DarkInput
            type="text"
            value={guita}
            onChange={(e) => setGuita(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <DarkLabel>Vocal 1:</DarkLabel>
          <DarkInput
            type="text"
            value={vocal1}
            onChange={(e) => setVocal1(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <DarkLabel>Vocal 2:</DarkLabel>
          <DarkInput
            type="text"
            value={vocal2}
            onChange={(e) => setVocal2(e.target.value)}
            required
          />
        </FormGroup>
        <DarkButton type="submit">Salvar Escala</DarkButton>
      </DarkForm>
        <DarkButton onClick={() => {
                            navigate("/")
                        }}>Voltar</DarkButton>
    </DarkWrapper>
  );
};

export default ScheduleForm;
