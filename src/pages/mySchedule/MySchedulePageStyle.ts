import styled from 'styled-components';
import Button from '../../components/buttons/Buttons';

export const MyScheduleContainer = styled.main`
  width: 100%;
  min-height: 100%;
  padding: 48px 16px 60px;
  box-sizing: border-box;

  @media (max-width: 670px) {
    padding: 28px 12px 36px;
  }
`;

export const Hero = styled.header`
  width: min(100%, 940px);
  margin: 0 auto 30px;
  text-align: center;

  > span {
    color: var(--color-primary);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  h1 {
    margin: 8px 0;
    font-size: clamp(2rem, 5vw, 2.8rem);
  }

  p {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.55;
  }
`;

export const AssignmentGrid = styled.section`
  width: min(100%, 940px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const AssignmentCard = styled.article<{ $featured: boolean }>`
  position: relative;
  padding: 22px;
  border: 1px solid ${({ $featured }) => $featured ? 'var(--color-primary)' : 'var(--color-border-soft)'};
  border-radius: 18px;
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: ${({ $featured }) => $featured
    ? '0 18px 42px color-mix(in srgb, var(--color-primary) 17%, transparent)'
    : '0 8px 24px var(--color-shadow)'};

  h2 {
    margin: 18px 0;
    font-size: 1.35rem;
  }

  .next-label {
    display: block;
    margin-bottom: 5px;
    color: var(--color-primary);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  > strong {
    color: var(--color-primary);
    font-size: 0.9rem;
    white-space: nowrap;
  }
`;

export const TypeLabel = styled.span`
  color: var(--color-text-muted);
  font-size: 0.86rem;
  font-weight: 700;
`;

export const InfoLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  color: var(--color-text-muted);
  line-height: 1.4;

  svg {
    flex-shrink: 0;
    color: var(--color-primary);
  }

  strong {
    color: var(--color-text-strong);
  }
`;

export const RoleList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
`;

export const RoleChip = styled.span`
  padding: 7px 11px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 42%, var(--color-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 12%, var(--color-surface));
  color: var(--color-primary);
  font-size: 0.85rem;
  font-weight: 750;
`;

export const RepertoireSection = styled.section`
  margin-top: 20px;
  padding: 15px;
  border: 1px solid var(--color-border-soft);
  border-radius: 12px;
  background: var(--color-surface-muted);

  > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    > div {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--color-text-strong);
    }

    svg {
      color: var(--color-primary);
    }

    > span {
      color: var(--color-text-muted);
      font-size: 0.78rem;
      white-space: nowrap;
    }
  }

  > p {
    margin: 12px 0 0;
    color: var(--color-text-muted);
    font-size: 0.9rem;
    line-height: 1.45;
  }

  .repertoire-group {
    margin-top: 14px;

    > span {
      display: block;
      margin-bottom: 7px;
      color: var(--color-text-muted);
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    ol {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 0;
      padding-left: 24px;
    }

    li {
      padding-left: 3px;
      color: var(--color-primary);

      strong {
        color: var(--color-text-strong);
        font-size: 0.92rem;
      }

      small {
        display: inline-flex;
        margin-left: 8px;
        padding: 2px 6px;
        border-radius: 5px;
        background: color-mix(in srgb, var(--color-primary) 12%, var(--color-surface));
        color: var(--color-primary);
        font-weight: 800;
      }
    }
  }
`;

export const CalendarButton = styled(Button)`
  && {
    width: 100%;
    margin-top: 20px;
  }
`;

export const EmptyState = styled.section`
  width: min(100%, 620px);
  margin: 0 auto;
  padding: 46px 24px;
  border: 1px dashed var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
  text-align: center;

  svg {
    color: var(--color-primary);
    font-size: 2.4rem;
  }

  h2 {
    margin: 16px 0 8px;
  }

  p {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.5;
  }
`;

export const ScheduleLink = styled(Button).attrs({ variant: 'secondary' })`
  && {
    width: fit-content;
    margin: 24px auto 0;
    text-decoration: none;
  }
`;
