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
  Janeiro: [
    { date: "05/01/2025", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.1"], guita: musicians["guita.3"], vocal1: musicians["vocal.9"], vocal2: musicians[""] },
    { date: "12/01/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.2"], guita: musicians["guita.1"], vocal1: musicians["vocal.9"], vocal2: musicians[""] },
    { date: "19/01/2025", teclas: musicians[""], batera: musicians[""], bass: musicians[""], guita: musicians[""], vocal1: musicians[""], vocal2: musicians[""] },
    { date: "26/01/2025", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.1"], guita: musicians["guita.4"], vocal1: musicians["vocal.9"], vocal2: musicians[""] }
  ],
  Fevereiro: [
    { date: "02/02/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.4"], guita: musicians["guita.3"], vocal1: musicians["vocal.9"], vocal2: musicians[""] },
    { date: "09/02/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.4"], guita: musicians["guita.3"], vocal1: musicians["vocal.9"], vocal2: musicians[""] },
    { date: "16/02/2025", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.1"], guita: musicians["guita.1"], vocal1: musicians["vocal.9"], vocal2: musicians[""] },
    { date: "23/02/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.2"], guita: musicians["guita.4"], vocal1: musicians["vocal.9"], vocal2: musicians[""] }
  ],
  Março: [
    { date: "02/03/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.4"], guita: musicians["guita.3"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.4"] },
    { date: "09/03/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.1"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.2"] },
    { date: "16/03/2025", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.2"], guita: musicians["guita.4"], vocal1: musicians["vocal.5"], vocal2: musicians["vocal.2"] },
    { date: "23/03/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.3"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.4"] },
    { date: "30/03/2025", teclas: musicians["teclas.1"], batera: musicians["batera.1"], bass: musicians["bass.1"], guita: musicians["guita.2"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.2"] }
  ],
  Abril: [
    { date: "06/04/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.2"], guita: musicians["guita.1"], vocal1: musicians["vocal.2"], vocal2: musicians["vocal.5"] },
    { date: "13/04/2025", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.1"], guita: musicians["guita.4"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.2"] },
    { date: "20/04/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.3"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.5"] },
    { date: "27/04/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.2"], guita: musicians["guita.2"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.2"] }
  ],
  Maio: [
    { date: "04/05/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.4"], guita: musicians["guita.1"], vocal1: musicians["vocal.5"], vocal2: musicians["vocal.7"] },
    { date: "11/05/2025", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.1"], guita: musicians["guita.4"], vocal1: musicians["vocal.6"], vocal2: musicians["vocal.2"] },
    { date: "18/05/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.3"], vocal1: musicians["vocal.5"], vocal2: musicians["vocal.1"] },
    { date: "25/05/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.2"], guita: musicians["guita.2"], vocal1: musicians["vocal.2"], vocal2: musicians["vocal.3"] }
  ],
  Junho: [
    { date: "01/06/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.4"], guita: musicians["guita.1"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.5"] },
    { date: "08/06/2025", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.2"], guita: musicians["guita.2"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.2"] },
    { date: "15/06/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.3"], vocal1: musicians["vocal.5"], vocal2: musicians["vocal.7"] },
    { date: "22/06/2025", teclas: musicians["teclas.1"], batera: musicians["batera.1"], bass: musicians["bass.1"], guita: musicians["guita.4"], vocal1: musicians["vocal.6"], vocal2: musicians["vocal.2"] },
    { date: "29/06/2025", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.4"], guita: musicians["guita.2"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.5"] }
  ],
  Julho: [
    { date: "06/07/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.2"], guita: musicians["guita.1"], vocal1: musicians["vocal.2"], vocal2: musicians["vocal.4"] },
    { date: "13/07/2025", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.1"], guita: musicians["guita.4"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.2"] },
    { date: "20/07/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.3"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.5"] },
    { date: "27/07/2025", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.2"], guita: musicians["guita.2"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.4"] }
  ],
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
      { date: "27/10/2024", teclas: musicians["teclas.1"], batera: musicians["batera.1"], bass: musicians["bass.1"], guita: musicians["guita.2"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.2"] }
    ],
    Novembro: [
      { date: "03/11/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.2"], guita: musicians["guita.1"], vocal1: musicians["vocal.2"], vocal2: musicians["vocal.5"] },
      { date: "10/11/2024", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.1"], guita: musicians["guita.4"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.2"] },
      { date: "17/11/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.3"], vocal1: musicians["vocal.3"], vocal2: musicians["vocal.5"] },
      { date: "24/11/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.2"], guita: musicians["guita.2"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.2"] }
    ],
    Dezembro: [
      { date: "01/12/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.4"], guita: musicians["guita.1"], vocal1: musicians["vocal.5"], vocal2: musicians["vocal.7"] },
      { date: "08/12/2024", teclas: musicians["teclas.1"], batera: musicians["batera.3"], bass: musicians["bass.1"], guita: musicians["guita.4"], vocal1: musicians["vocal.6"], vocal2: musicians["vocal.2"] },
      { date: "15/12/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.3"], guita: musicians["guita.3"], vocal1: musicians["vocal.5"], vocal2: musicians["vocal.1"] },
      { date: "22/12/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.2"], guita: musicians["guita.2"], vocal1: musicians["vocal.2"], vocal2: musicians["vocal.3"] },
      { date: "29/12/2024", teclas: musicians["teclas.1"], batera: musicians["batera.2"], bass: musicians["bass.4"], guita: musicians["guita.1"], vocal1: musicians["vocal.1"], vocal2: musicians["vocal.5"] }
    ]
};

return schedules;
}