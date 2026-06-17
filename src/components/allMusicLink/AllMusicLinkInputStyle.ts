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
