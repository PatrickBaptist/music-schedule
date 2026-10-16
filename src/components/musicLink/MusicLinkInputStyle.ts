import styled from 'styled-components';
import { formCardSurface, formControlStyles } from '../formCard/formCardStyles';

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 0;
  position: relative;
  ${formCardSurface}
  width: min(100%, 620px);
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  overflow-x: hidden;

  .selected-date-summary {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 12px 14px;
    border: 1px solid var(--color-border-soft);
    border-radius: 10px;
    box-sizing: border-box;
    background: var(--color-surface-muted);

    label {
      color: var(--color-text-strong);
      font-size: 14px;
      font-weight: 700;
    }

    span {
      color: var(--color-text-muted);
      font-size: 12px;
    }
  }

  input, textarea, select {
    ${formControlStyles}
  }

  button {
    width: auto;
    cursor: pointer;

    img {
      width: 20px;
    }
  }

  textarea,
  select {
    width: 100%;
  }

  @media (max-width: 720px) {
    padding: 16px;
    max-height: calc(100dvh - 188px);
  }
`;

export const ChordSheetFields = styled.section`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  box-sizing: border-box;
  border: 1px solid var(--color-border-soft);
  border-radius: 12px;
  background: var(--color-surface-muted);

  > label {
    color: var(--color-text-strong);
    font-size: 14px;
    font-weight: 700;
  }

  textarea { min-height: 230px; resize: vertical; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
`;

export const SuggestionsList = styled.ul`
  background: var(--color-surface);
  width: 100%;
  max-height: clamp(240px, 42dvh, 360px);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-top: 4px;
  list-style: none;
  padding: 0;
  overflow-y: auto;
  transition: all 0.2s ease;
  box-sizing: border-box;
  flex-shrink: 0;

  @media (max-width: 480px) {
    max-height: min(360px, 48dvh);
  }

  @media (max-width: 380px) {
    max-height: min(380px, 52dvh);
  }

  li {
    padding: 12px;
    cursor: pointer;
    border-bottom: 1px solid var(--color-border-soft);

    &:hover {
      background-color: var(--color-surface-muted);
    }

    .suggestion-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;

      @media (max-width: 480px) {
        align-items: flex-start;
        flex-direction: column;
      }
    }

    .music-name {
      font-size: 15px;
      font-weight: 500;
      color: var(--color-text-strong);
      overflow-wrap: anywhere;
      min-width: 0;
    }

    .add-label {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 13px;
      color: #007bff;
      font-weight: 600;
      opacity: 0.8;
      transition: opacity 0.2s ease;
      white-space: nowrap;

      svg {
        color: #007bff;
      }

      &:hover {
        opacity: 1;
      }
    }
  }
`;
