import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { MonthlySchedules } from '../components/Schedule'

export type MonthName = "Janeiro" | "Fevereiro" | "Março" | "Abril" | "Maio" | "Junho" | "Julho" | "Agosto" | "Setembro" | "Outubro" | "Novembro" | "Dezembro";

async function fetchMusicians(): Promise<Record<string, string>> {
  const docRef = doc(db, "musicians", "vsWO4fMHUuQUD5YTBcSK");
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as Record<string, string>;
  } else {
    throw new Error("Documento não encontrado");
  }
}

export async function createSchedules(): Promise<MonthlySchedules> {
  const musicians = await fetchMusicians();

const schedules = {
  Janeiro: [],
    Fevereiro: [],
    Março: [],
    Abril: [],
    Maio: [],
    Junho: [],
    Julho: [],
    Agosto: [
      { date: "04/08/2024", teclas: musicians["teclas.1"], batera: musicians["batera.1"], bass: musicians["bass.1"], guita: musicians["guita.1"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.4"] },
      { date: "11/08/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.2"], guita: musicians["guita.2"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.2"] },
      { date: "18/08/2024", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.3"], guita: musicians["guita.3"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.2"] },
      { date: "25/08/2024", teclas: musicians["teclas.1"], batera: musicians["batera.1"], bass: musicians["bass.1"], guita: musicians["guita.1"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.4"] }
    ],
    Setembro: [
      { date: "01/09/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.2"], guita: musicians["guita.2"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.2"] },
      { date: "08/09/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.3"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.2"] },
      { date: "15/09/2024", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.1"], guita: musicians["guita.1"], vocal1: musicians["vocal.5"], vocal2: musicians["vocal.8"] },
      { date: "22/09/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.2"], guita: musicians["guita.4"], vocal1: musicians["vocal.9"], vocal2: musicians[""] },
      { date: "29/09/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.4"], guita: musicians["guita.3"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.4"] }
    ],
    Outubro: [
      { date: "06/10/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.1"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.2"] },
      { date: "13/10/2024", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.2"], guita: musicians["guita.4"], vocal1: musicians["vocal.5"], vocal2: musicians["vocal.2"] },
      { date: "20/10/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.3"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.4"] },
      { date: "27/10/2024", teclas: musicians["teclas.1"], batera: musicians["batera.1"], bass: musicians["bass.1"], guita: musicians["guita.2"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.4"] }
    ],
    Novembro: [
      { date: "03/11/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.2"], guita: musicians["guita.1"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.4"] },
      { date: "10/11/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.4"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.2"] },
      { date: "17/11/2024", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.1"], guita: musicians["guita.3"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.4"] },
      { date: "24/11/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.2"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.2"] }
    ],
    Dezembro: [
      { date: "01/12/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.1"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.4"] },
      { date: "08/12/2024", teclas: musicians["teclas.1"], batera: musicians["batera.1"], bass: musicians["bass.1"], guita: musicians["guita.4"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.2"] },
      { date: "15/12/2024", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.2"], guita: musicians["guita.3"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.4"] },
      { date: "22/12/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.2"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.2"] },
      { date: "29/12/2024", teclas: musicians["teclas.1"], batera: musicians["batera.1"], bass: musicians["bass.1"], guita: musicians["guita.1"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.4"] }
    ]
};

return schedules;
}