import styled from 'styled-components';

export const ContainerForm = styled.div`
  width: 100%;
  max-width: 1024px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 0 150px;

  @media (max-width: 768px) {
    padding: 70px 50px 0px 50px;
  }

   /* Layout para mobile (default) */
  .form-row {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 45px;
  }

  .form-column {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .form-container {
    width: 100%;
    display: flex;
    flex-direction: column;

  }

  .form-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .button-container {
    margin-top: auto;
    padding-top: 20px;
    display: flex;
    justify-content: space-around;
  }

  /* Media query para desktop */
  @media (min-width: 768px) {
    .form-row {
      flex-direction: row;
      justify-content: space-between;
      gap: 25px;
      align-items: stretch; /* Crucial para alinhar a altura */
    }

    .form-column {
      flex: 1;
      display: flex;
    }

    .form-container {
      height: 100%;
    }

    /* Garante que os formulários ocupem toda a altura */
    .form-content {
      height: 100%;
    }
  }

  h2 {
    text-align: center;
    margin-bottom: 25px;
    width: 100%;
    font-size: 1.5rem;
    padding-bottom: 10px;
  }
`;

export const DarkForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 18px;
`;

export const DarkTitle = styled.h1`
  text-align: center;
`;
  
export const FormGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const DarkInput = styled.input`
  width: 100%;
  height: 25px;
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
  min-height: 25px;
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

export const DarkButtonCancel = styled.button`
  max-width: 400px;
  background-color: #555;
  color: #fff;
  font-size: 13px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  padding: 10px 10px;

  &:hover {
    background-color: #acacac;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
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
