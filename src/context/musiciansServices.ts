/*import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface Musicians {
  [key: string]: string;
}

export const fetchMusicians = async (): Promise<Musicians> => {
  const docRef = doc(db, 'musicians', 'vsWO4fMHUuQUD5YTBcSK'); // Substitua 'yourDocumentId' pelo ID do documento que contém os músicos
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Musicians;
  } else {
    console.error('No such document!');
    return {};
  }
};*/
