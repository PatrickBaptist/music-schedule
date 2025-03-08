import styled from 'styled-components';

export const DarkWrapper = styled.div`
  background-color: #121212;
  color: #e0e0e0;
  padding: 40px 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DarkTitle = styled.h1`
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 30px;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;

export const DarkForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

export const DarkInput = styled.input`
  background-color: #333;
  color: #fff;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #444;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #6200ea;
    outline: none;
  }
`;

export const DarkSelect = styled.select`
  background-color: #333;
  color: #fff;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #444;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #6200ea;
    outline: none;
  }
`;

export const DarkButton = styled.button`
  background-color: #333;
  color: #fff;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #444;
  border-radius: 5px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    border-color: #6200ea;
    outline: none;
  }
`;

export const DarkLabel = styled.label`
  color: #fff;
  font-size: 1rem;
  margin-bottom: 5px;
`;
