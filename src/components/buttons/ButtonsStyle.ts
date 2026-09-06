import styled, { css } from "styled-components";
import type { ButtonSize, ButtonVariant } from "./Buttons";

interface ContainerButtonProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}

const sizes = {
  sm: css`
    min-height: 32px;
    padding: 0 10px;
    font-size: 0.8rem;
  `,
  md: css`
    min-height: 38px;
    padding: 0 14px;
    font-size: 0.9rem;
  `,
  lg: css`
    min-height: 44px;
    padding: 0 18px;
    font-size: 1rem;
  `,
};

const variants = {
  primary: css`
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: var(--color-on-primary);

    &:hover:not(:disabled) {
      filter: brightness(0.92);
    }
  `,
  secondary: css`
    border-color: var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-strong);

    &:hover:not(:disabled) {
      background: var(--color-surface-muted);
    }
  `,
  danger: css`
    border-color: #dc2626;
    background: #ef4444;
    color: #fff;

    &:hover:not(:disabled) {
      background: #dc2626;
    }
  `,
  ghost: css`
    border-color: transparent;
    background: transparent;
    color: var(--color-text-strong);
    &:hover:not(:disabled) {
      background: var(--color-surface-muted);
      color: var(--color-primary);
    }
  `,
  icon: css`
    min-width: 40px;
    width: 40px;
    padding: 0;
    border-color: transparent;
    background: var(--color-surface-muted);
    color: var(--color-text-strong);
    border-radius: 999px;
    &:hover:not(:disabled) {
      border-color: color-mix(in srgb, var(--color-primary) 45%, var(--color-border));
      color: var(--color-primary);
    }
  `,
  tab: css`
    border-color: transparent;
    background: transparent;
    color: var(--color-text-muted);
    &[aria-selected="true"], &.active {
      background: var(--color-surface-muted);
      color: var(--color-primary);
    }
  `,
  unstyled: css`
    min-height: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: inherit;
  `,
};

export const ContainerButton = styled.button<ContainerButtonProps>`
  appearance: none;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  border: 1px solid transparent;
  border-radius: 8px;
  font: inherit;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease,
    filter 0.15s ease;

  ${({ $size }) => sizes[$size]}
  ${({ $variant }) => variants[$variant]}

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    filter: grayscale(0.15);
  }
`;
