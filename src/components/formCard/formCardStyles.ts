import { css } from "styled-components";

// Shared foundation for the music, schedule and organization form cards.
export const formCardSurface = css`
  width: 100%;
  max-width: 620px;
  min-width: 0;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 18px;
  background: var(--color-surface);
  color: var(--color-text-strong);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);

  @media (max-width: 720px) {
    padding: 16px;
  }
`;

export const formControlStyles = css`
  width: 100%;
  min-width: 0;
  min-height: 40px;
  box-sizing: border-box;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-input-bg);
  color: var(--color-input-text);
  font-family: inherit;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-visible {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 18%, transparent);
  }

  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
