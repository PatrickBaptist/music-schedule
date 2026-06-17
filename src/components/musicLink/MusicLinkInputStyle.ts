import styled from 'styled-components';

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 0;
  position: relative;
  width: 100%;
  max-width: 620px;
  max-height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  background: var(--color-surface);
  color: var(--color-text-strong);

  input {
    width: 100%;
    min-height: 40px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px 0;
    outline:  none;
    padding: 6px;
    font-size: 16px;

    &:focus {
      border-color: #2EBEF2;
      box-shadow: 0 0 5px rgba(0, 62, 234, 0.5);
    }
  }

  button {
    width: auto;
    cursor: pointer;
    background-color:#007BFF;

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
  }
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
