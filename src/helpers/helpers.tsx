export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export const formatFirestoreDate = (date?: string | Date | FirestoreTimestamp): string => {
  if (!date) return "";
  
  let d: Date;

   if (typeof date === "object" && "_seconds" in date) {
    d = new Date(date._seconds * 1000 + Math.floor(date._nanoseconds / 1000000));
  } else {
    d = new Date(date);
  }

  return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleString();
};

export const formatDateDDMMYYYY = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Janeiro = 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
