import styled from 'styled-components';

export const DarkWrapper = styled.div`
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ContainerForm = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow: auto;
  padding: 50px 0;
  gap: 45px;

  &::-webkit-scrollbar {
    width: 10px;
    background-color: #0e1e30ff;
    border-radius: 1em;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #58a6ff;
    border-radius: 1em;
  }
`;

export const DarkTitle = styled.h1`
  text-align: center;
`;


export const DarkForm = styled.form`
  width: 100%;
  max-width: 600px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  gap: 20px;
  `;
  
export const FormGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 35px;
`;

export const DarkInput = styled.input`
  width: 100%;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px 0;
  border-radius: 3px;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #2EBEF2;
    box-shadow: 0 0 5px rgba(0, 62, 234, 0.5);
  }
`;

export const DarkSelect = styled.select`
  width: 100%;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px 0;
  border-radius: 3px;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #2EBEF2;
    box-shadow: 0 0 5px rgba(0, 62, 234, 0.5);
  }
`;

export const DarkButton = styled.button`
  max-width: 400px;
  background-color: #007BFF;
  color: #fff;
  font-size: 13px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  padding: 10px 10px;

  &:hover {
    background-color: #2EBEF2;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }
`;

export const DarkLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 5px;
  letter-spacing: 0.5px;
`;

export const BackButton = styled(DarkButton)`
  background-color: #444;

  &:hover {
    background-color: #333;
  }
`;
