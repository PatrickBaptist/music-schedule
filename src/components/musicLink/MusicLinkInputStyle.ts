import styled from 'styled-components';

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  position: relative;

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

export const SuggestionsList = styled.ul`
  background: #fff;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 4px;
  list-style: none;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
  transition: all 0.2s ease;

  li {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #f5f5f5;
    }

    .suggestion-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .music-name {
      font-size: 15px;
      font-weight: 500;
      color: #333;
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

      svg {
        color: #007bff;
      }

      &:hover {
        opacity: 1;
      }
    }
  }
`;
