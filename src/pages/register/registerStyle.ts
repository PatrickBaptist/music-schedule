import ReactInputMask from "react-input-mask";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 20px;
`;

export const FormWrapper = styled.form`
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  .show-password { 
    width: 100%; 
    height: 20px; 
    display: flex; 
    align-items: center; 
    justify-content: flex-start; 
    gap: 5px; }
`;

export const Logo = styled.img`
  width: 180px;
  margin-bottom: 20px;
  object-fit: cover;
`;

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const FieldContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: flex-start;
  gap: 5px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: all 0.2s ease;
  &:focus {
    border-color: #2EBEF2;
    box-shadow: 0 0 5px rgba(46, 190, 242, 0.4);
  }
`;

export const StyledInputMask = styled(ReactInputMask)`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: all 0.2s ease;
  &:focus {
    border-color: #2EBEF2;
    box-shadow: 0 0 5px rgba(46, 190, 242, 0.4);
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007BFF;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover {
    background-color: rgba(0, 62, 234, 0.5);
  }
`;

export const LoginPrompt = styled.div`
  margin-top: 15px;
  font-size: 14px;
  color: #555;
  text-align: center;

  a {
    color: #2EBEF2;
    font-weight: 600;
    text-decoration: none;
    margin-left: 5px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const RolesContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(5, auto);
  gap: 10px;
  margin-bottom: 20px;
`;

export const RolesLabel = styled.label`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  grid-column: 1 / -1; /* ocupa toda a largura do grid */
`;

export const RoleItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  label {
    font-size: 14px;
    cursor: pointer;
  }
`;
