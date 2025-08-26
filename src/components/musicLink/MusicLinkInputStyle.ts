import styled from 'styled-components';

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  input {
    width: 350px;
    height: 25px;
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
    width: 100px;
    cursor: pointer;
    background-color:#007BFF;

    img {
      width: 20px;
    }
  }
`;