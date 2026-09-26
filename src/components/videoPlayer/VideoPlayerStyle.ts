import styled, { css } from "styled-components";
import Button from "../buttons/Buttons";

export const PlayerLayer = styled.div<{ $minimized: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 10020;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  background: rgba(5, 10, 18, 0.82);
  backdrop-filter: blur(5px);

  ${({ $minimized }) => $minimized && css`
    padding: 0;
    background: transparent;
    backdrop-filter: none;
    pointer-events: none;
  `}
`;

export const PlayerCard = styled.section<{ $minimized: boolean }>`
  width: min(920px, 100%);
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: #080808;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);

  ${({ $minimized }) => $minimized && css`
    position: absolute;
    right: 18px;
    bottom: 18px;
    width: min(380px, calc(100vw - 24px));
    border-radius: 12px;
    pointer-events: auto;
    box-shadow: 0 14px 44px rgba(0, 0, 0, 0.42);

    @media (max-width: 670px) {
      right: 12px;
      bottom: 104px;
    }
  `}
`;

export const PlayerHeader = styled.header`
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 10px 8px 14px;
  box-sizing: border-box;
  background: var(--color-surface);
  color: var(--color-text-strong);

  > div:last-child {
    display: flex;
    gap: 4px;
  }
`;

export const PlayerTitle = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 700;

  svg {
    flex-shrink: 0;
    color: #ef4444;
    font-size: 20px;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const PlayerControl = styled(Button).attrs({ variant: "unstyled" })`
  width: 34px;
  height: 34px;
  display: inline-grid;
  place-items: center;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-strong);
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: var(--color-surface-muted);
  }
`;

export const PlayerViewport = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

export const PlayerLoading = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: grid;
  place-items: center;
  background: #000;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
`;
