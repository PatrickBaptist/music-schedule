import styled from 'styled-components';

export const CalendarBody = styled.section`
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
`;

export const FilterBar = styled.div`
  width: min(100%, 1080px);
  margin: 0 auto 14px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;

  button {
    min-height: 34px;
    padding: 7px 11px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: 1px solid var(--color-border);
    border-radius: 999px;
    background: var(--color-surface);
    color: var(--color-text-muted);
    font: inherit;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
  }

  button[aria-pressed='false'] {
    opacity: 0.48;
    filter: grayscale(1);
  }

  button:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  i {
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }

  i.sunday { background: #2ebef2; }
  i.thursday { background: #8b5cf6; }
  i.special { background: #f59e0b; }
`;

export const CalendarGrid = styled.div`
  width: min(100%, 1080px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
`;

export const CalendarWeekday = styled.div`
  padding: 8px 4px;
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
`;

export const EmptyCalendarDay = styled.div`
  min-height: 112px;

  @media (max-width: 700px) {
    min-height: 76px;
  }
`;

export const CalendarDay = styled.button<{ $hasSchedule: boolean; $isNextSunday: boolean }>`
  position: relative;
  min-width: 0;
  min-height: 112px;
  padding: 9px;
  overflow: hidden;
  border: 1px solid ${({ $isNextSunday, $hasSchedule }) =>
    $isNextSunday ? '#ef4444' : $hasSchedule ? 'var(--color-primary)' : 'var(--color-border-soft)'};
  border-radius: 12px;
  background: ${({ $hasSchedule }) => $hasSchedule
    ? 'color-mix(in srgb, var(--color-primary) 8%, var(--color-surface))'
    : 'var(--color-surface)'};
  color: var(--color-text);
  text-align: left;
  cursor: ${({ $hasSchedule }) => $hasSchedule ? 'pointer' : 'default'};
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

  &:enabled:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px var(--color-shadow);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.58;
  }

  .day-number {
    display: block;
    color: ${({ $isNextSunday }) => $isNextSunday ? '#ef4444' : 'var(--color-text-strong)'};
    font-weight: 800;
  }

  @media (max-width: 700px) {
    min-height: 76px;
    padding: 6px;
    border-radius: 9px;
  }
`;

export const EventLabels = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  margin-top: 7px;

  > span {
    max-width: 100%;
    padding: 2px 6px;
    overflow: hidden;
    border-radius: 999px;
    color: #fff;
    font-size: 0.64rem;
    font-weight: 800;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sunday { background: #1686ad; }
  .thursday { background: #7c3aed; }
  .special { background: #b66a04; }
  .more-events { background: var(--color-text-muted); }

  @media (max-width: 700px) {
    > span {
      width: 7px;
      height: 7px;
      padding: 0;
      font-size: 0;
    }
  }
`;

export const AvatarPile = styled.span`
  position: absolute;
  right: 7px;
  bottom: 8px;
  display: flex;
  justify-content: flex-end;

  > span {
    width: 25px;
    height: 25px;
    margin-left: -7px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 2px solid var(--color-surface);
    border-radius: 50%;
    background: #1f2937;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 800;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .more {
    background: var(--color-primary);
    color: var(--color-on-primary);
  }

  @media (max-width: 700px) {
    right: 3px;
    bottom: 5px;

    > span {
      width: 20px;
      height: 20px;
      margin-left: -9px;
      font-size: 0.58rem;
    }
  }
`;

export const CalendarOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10020;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(3, 10, 18, 0.78);
  backdrop-filter: blur(8px);
  overflow-y: auto;
`;

export const CalendarModal = styled.div`
  width: min(100%, 520px);
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding: 22px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42);
`;

export const EventBlock = styled.section`
  padding: 16px;
  border: 1px solid var(--color-border-soft);
  border-radius: 14px;
  background: var(--color-surface-muted);

  & + & {
    margin-top: 12px;
  }

  header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  h3 {
    margin: 0;
    font-size: 1rem;
  }
`;

export const TypeBadge = styled.span<{ $type: 'sunday' | 'thursday' | 'special' }>`
  padding: 4px 8px;
  border-radius: 999px;
  background: ${({ $type }) => $type === 'sunday' ? '#1686ad' : $type === 'thursday' ? '#7c3aed' : '#b66a04'};
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
`;

export const PredictionLabel = styled.p`
  margin: 0 0 8px;
  color: #8b5cf6;
  font-size: 0.78rem;
  font-weight: 700;
`;

export const CalendarModalHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;

  span {
    color: var(--color-primary);
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h2 {
    margin: 5px 0 0;
    font-size: 1.35rem;
    text-transform: capitalize;
  }
`;

export const CloseButton = styled.button`
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-surface-muted);
  color: var(--color-text-strong);
  cursor: pointer;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
`;

export const ModalScheduleContent = styled.div`
  p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 0;
    padding: 10px 0;
    border-bottom: 1px solid var(--color-border-soft);
  }

  p > strong {
    min-width: 90px;
    color: var(--color-text-strong);
  }
`;

export const OutfitRow = styled.p`
  border-bottom: 0 !important;

  span {
    color: var(--color-text-muted);
    font-style: italic;
  }
`;
