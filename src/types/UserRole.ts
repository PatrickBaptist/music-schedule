export enum UserRole {
  Admin = "admin",
  Guest = "guest",
  Minister = "minister",
  Vocal = "vocal",
  Guitar = "guitar",
  Keyboard = "keyboard",
  Bass = "bass",
  Drums = "drums",
  Violao = "violao",
  Sound = "sound",
  Lighting = "lighting",
  Midia = "midia",
  DataShow = "datashow",
  Leader = "leader"
}

export const roleOptions = [
  { label: "Visitante", value: UserRole.Guest },
  { label: "Líder", value: UserRole.Leader },
  { label: "Ministro", value: UserRole.Minister },
  { label: "Vocal", value: UserRole.Vocal },
  { label: "Guitarra", value: UserRole.Guitar },
  { label: "Teclado", value: UserRole.Keyboard },
  { label: "Baixo", value: UserRole.Bass },
  { label: "Bateria", value: UserRole.Drums },
  { label: "Violão", value: UserRole.Violao },
  { label: "Iluminação", value: UserRole.Lighting },
  { label: "Mídia", value: UserRole.Midia },
  { label: "Datashow", value: UserRole.DataShow },
  { label: "Operador de som", value: UserRole.Sound },
];
