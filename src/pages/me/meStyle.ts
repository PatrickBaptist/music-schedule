import { motion } from "framer-motion";
import styled from "styled-components";

export const ProfileTitle = styled(motion.h1)`
  font-size: 2.2rem;
  margin-bottom: 25px;
  text-align: center;
`;

export const ProfileList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; // tudo à esquerda
`;

export const ProfileItem = styled(motion.div)`
  font-size: 1.3rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  strong {
    color: #1e90ff;
    font-weight: 600;
    margin-right: 6px;
  }
`;

export const Badge = styled.span`
  background-color: #ff7f50;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  margin-left: 6px;
  margin-top: 4px;
  font-size: 0.9rem;
  display: inline-block;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    background-color: #ff4500;
  }
`;

export const DarkWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const ContainerForm = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  gap: 45px;
  padding: 70px 20px 40px 20px;

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
    justify-content: center;
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

export const DarkForm = styled(motion.form)`
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
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
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  letter-spacing: 0.5px;
`;

export const BackButton = styled(DarkButton)`
  background-color: var(--color-text-muted);

  &:hover {
    background-color: var(--color-text-strong);
  }
`;
