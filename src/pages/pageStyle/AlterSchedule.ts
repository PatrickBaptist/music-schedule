import styled from 'styled-components';

export const DarkWrapper = styled.div`
  background-color: #06141b;
  color: #e0e0e0;
  padding: 40px 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const DarkTitle = styled.h1`
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 700;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const DarkForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  padding: 25px;
  gap: 5px;
`;

export const DarkInput = styled.input`
  background-color: #333;
  color: #fff;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #444;
  border-radius: 8px;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #6200ea;
    box-shadow: 0 0 5px rgba(98, 0, 234, 0.5);
  }
`;

export const DarkSelect = styled.select`
  background-color: #333;
  color: #fff;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #444;
  border-radius: 8px;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #6200ea;
    box-shadow: 0 0 5px rgba(98, 0, 234, 0.5);
  }
`;

export const DarkButton = styled.button`
  background-color: #6200ea;
  color: #fff;
  padding: 12px;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #3700b3;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }
`;

export const DarkLabel = styled.label`
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 5px;
  letter-spacing: 0.5px;
`;

export const BackButton = styled(DarkButton)`
  background-color: #444;
  margin-top: 20px;
  &:hover {
    background-color: #333;
  }
`;
