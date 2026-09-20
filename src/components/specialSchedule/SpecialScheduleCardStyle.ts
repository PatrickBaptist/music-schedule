import styled from "styled-components";

export const ScheduleCard = styled.article`
  width: 100%;
  max-width: 420px;
  box-sizing: border-box;
  overflow: hidden;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 8px 24px var(--color-shadow);
  color: var(--color-text);

  .schedule-card-header {
    padding: 18px;
    border-bottom: 1px solid var(--color-border-soft);
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-primary) 12%, var(--color-surface)),
      var(--color-surface)
    );

    h5 {
      margin: 0 0 12px;
      color: var(--color-text-strong);
      font-size: 19px;
      line-height: 1.25;
    }
  }

  .schedule-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;

    span {
      min-height: 28px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border: 1px solid var(--color-border-soft);
      border-radius: 999px;
      background: var(--color-surface-muted);
      color: var(--color-text-muted);
      font-size: 12px;
      font-weight: 700;
      text-transform: capitalize;
    }

    svg {
      color: var(--color-primary);
    }
  }

  .schedule-roles {
    padding: 6px 18px;
  }

  .schedule-role {
    min-height: 43px;
    display: grid;
    grid-template-columns: minmax(95px, 0.8fr) minmax(0, 1.2fr);
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--color-border-soft);

    > strong {
      color: var(--color-text-muted);
      font-size: 13px;
      font-weight: 700;
    }

    &.is-highlighted {
      > strong,
      .schedule-role-value {
        color: #f59e0b;
        font-weight: 700;
      }
    }

    &:last-child {
      border-bottom: 0;
    }
  }

  .schedule-role-value {
    min-width: 0;
    display: flex;
    justify-content: flex-end;
    color: var(--color-text-strong);
    font-size: 14px;
    text-align: right;
  }

  .vacant-role,
  .is-empty {
    color: var(--color-text-muted) !important;
    font-style: italic;
    font-weight: 500 !important;
  }

  .outfit-card {
    display: flex;
    align-items: center;
    gap: 11px;
    margin: 6px 12px 12px;
    padding: 11px 12px;
    border: 1px solid color-mix(in srgb, var(--color-primary) 20%, var(--color-border-soft));
    border-radius: 10px;
    background: color-mix(in srgb, var(--color-primary) 6%, var(--color-surface-muted));

    > svg {
      flex-shrink: 0;
      color: var(--color-primary);
      font-size: 18px;
    }

    div {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    span {
      color: var(--color-text-muted);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    strong {
      color: var(--color-text-strong);
      font-size: 14px;
    }
  }

  @media (max-width: 478px) {
    max-width: 100%;
    border-radius: 14px;
  }

  @media (max-height: 700px) and (max-width: 768px) {
    max-height: calc(100dvh - 190px);
    overflow-y: auto;

    .schedule-role {
      min-height: 40px;
    }
  }

  @media (max-height: 560px) and (max-width: 768px) {
    max-height: calc(100dvh - 150px);
  }
`;
