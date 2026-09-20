export const WORSHIP_MOMENTS = [
  'Momento de Louvor',
  '1º Momento',
  '2º Momento',
  '3º Momento',
  'Participação',
  'Dízimos e Ofertas',
  'Batismo',
  'Ceia',
  'Final do Culto',
] as const;

export const normalizeWorshipMoment = (moment: string) =>
  moment === 'Culto de Quinta' ? 'Momento de Louvor' : moment;

export const getWorshipMomentPosition = (moment: string) => {
  const position = WORSHIP_MOMENTS.indexOf(
    normalizeWorshipMoment(moment) as (typeof WORSHIP_MOMENTS)[number]
  );

  return position === -1 ? WORSHIP_MOMENTS.length : position;
};
