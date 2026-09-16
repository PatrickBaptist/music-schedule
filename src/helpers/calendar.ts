type CalendarEventInput = {
  id: string;
  date: Date;
  title: string;
  roles: string[];
  outfitColor: string;
};

const formatCalendarDate = (date: Date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('');

const escapeCalendarText = (value: string) => value
  .replace(/\\/g, '\\\\')
  .replace(/\n/g, '\\n')
  .replace(/,/g, '\\,')
  .replace(/;/g, '\\;');

const getSafeFileName = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9-_]+/g, '-')
  .replace(/^-|-$/g, '')
  .toLocaleLowerCase();

export const downloadCalendarEvent = (event: CalendarEventInput) => {
  const endDate = new Date(event.date);
  endDate.setDate(endDate.getDate() + 1);

  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const description = [
    `Função: ${event.roles.join(', ')}`,
    `Paleta: ${event.outfitColor || 'Não definida'}`,
  ].join('\n');

  const calendar = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Music Schedule//Escala//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${escapeCalendarText(event.id)}@music-schedule`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${formatCalendarDate(event.date)}`,
    `DTEND;VALUE=DATE:${formatCalendarDate(endDate)}`,
    `SUMMARY:${escapeCalendarText(`${event.title} — ${event.roles.join(', ')}`)}`,
    `DESCRIPTION:${escapeCalendarText(description)}`,
    `URL:${window.location.origin}/my-schedule`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob(['\uFEFF', calendar], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${formatCalendarDate(event.date)}-${getSafeFileName(event.title) || 'escala'}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
