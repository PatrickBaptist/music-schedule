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
