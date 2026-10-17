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
    min-width: 0;
    box-sizing: border-box;
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

    img {
      width: 20px;
    }
  }

  textarea,
  select {
    width: 100%;
  }

  &.music-library-form {
    width: min(100%, 920px);
    max-height: calc(100dvh - 102px);
    overflow-x: hidden;

    input,
    textarea,
    select {
      width: 100%;
      min-width: 0;
      max-width: 100%;
      box-sizing: border-box;
    }
  }

  .music-library-main-fields {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: end;
    gap: 12px;

    > * {
      min-width: 0;
      margin-bottom: 0;
    }

    > input:last-child {
      grid-column: 1 / -1;
    }
  }

  .music-library-more-options {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
    padding: 11px 12px;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    background: var(--color-surface-muted);

    summary {
      color: var(--color-primary);
      cursor: pointer;
      font-weight: 700;
    }
  }

  .music-library-more-options-content {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 14px;
  }

  .music-library-form-actions {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  @media (max-width: 720px) {
    padding: 16px;

    &.music-library-form {
      width: min(100%, 620px);
      max-height: calc(100dvh - 188px);
    }

    .music-library-main-fields {
      grid-template-columns: minmax(0, 1fr);

      > input:last-child {
        grid-column: auto;
      }
    }
  }
`;

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;

  label {
    font-size: 14px;
    font-weight: bold;
  }

  select {
    width: 100%;
    min-height: 40px;
    padding: 6px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px 0;
    outline: none;
    font-size: 14px;
  }
`;
