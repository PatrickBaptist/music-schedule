export type ProfileCompletionField = "photoURL" | "nickname" | "phone" | "birthDate";

export interface ProfileCompletionSource {
  photoURL?: string | null;
  nickname?: string | null;
  phone?: string | null;
  birthDate?: string | null;
}

const isBlank = (value?: string | null) => !value || !value.trim();

export const getPendingProfileFields = (
  user?: ProfileCompletionSource | null
): ProfileCompletionField[] => {
  if (!user) return [];

  return [
    isBlank(user.photoURL) ? "photoURL" : null,
    isBlank(user.nickname) ? "nickname" : null,
    isBlank(user.phone) ? "phone" : null,
    isBlank(user.birthDate) ? "birthDate" : null,
  ].filter(Boolean) as ProfileCompletionField[];
};
