import styled from 'styled-components';

export const PersonListContainer = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 8px;
  max-width: calc(100% - 90px);
`;

export const PersonButton = styled.button<{ $clickable: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  max-width: 100%;
  padding: 2px 4px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font: inherit;
  white-space: nowrap;
  text-align: right;
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
  transition: color 0.2s ease, background-color 0.2s ease;

  &:enabled:hover {
    color: var(--color-primary);
    background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 1;
  }
`;

export const PersonInitials = styled.span`
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  background: #1f2937;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ModalOverlay = styled.div`
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

export const ModalCard = styled.div`
  width: min(100%, 430px);
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding: 22px 24px 28px;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42);
  text-align: center;

  h2 {
    margin: 18px 0 22px;
    color: var(--color-text-strong);
    font-size: clamp(1.6rem, 5vw, 2rem);
  }

  section {
    padding-top: 18px;
    border-top: 1px solid var(--color-border-soft);
  }

  h3 {
    margin: 0 0 12px;
    color: var(--color-text-muted);
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  @media (max-width: 520px) {
    padding: 18px 18px 24px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  text-align: left;
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

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

export const Avatar = styled.div`
  width: clamp(170px, 52vw, 230px);
  aspect-ratio: 1;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 4px solid var(--color-primary);
  border-radius: 50%;
  background: linear-gradient(145deg, var(--color-surface-muted), color-mix(in srgb, var(--color-primary) 28%, var(--color-surface)));
  color: var(--color-primary);
  box-shadow: 0 14px 35px color-mix(in srgb, var(--color-primary) 20%, transparent);
  font-size: 3.8rem;
  font-weight: 800;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Roles = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;

  > span:not([class]) {
    color: var(--color-text-muted);
  }
`;

export const RoleChip = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 7px 12px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 42%, var(--color-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 12%, var(--color-surface));
  color: var(--color-primary);
  font-size: 0.88rem;
  font-weight: 700;
`;
