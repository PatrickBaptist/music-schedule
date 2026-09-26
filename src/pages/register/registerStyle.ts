import ReactInputMask from "react-input-mask";
import { motion } from "framer-motion";
import styled from "styled-components";
import SharedButton from "../../components/buttons/Buttons";

export const ContainerRegiter = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FormWrapper = styled.form`
  width: 50vw;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 40px 30px;
  gap: 20px;

  .show-password { 
    width: 100%; 
    height: 20px; 
    display: flex; 
    align-items: center; 
    justify-content: flex-start; 
    gap: 5px; }

    @media (max-width: 768px) {
      width: 90vw;
    }
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
  justify-content: center;
  flex-direction: column;
  gap: 5px;
`;

export const Label = styled.label`
  font-size: 16px;
  font-weight: 600;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;

  &:focus {
  transition: all 0.2s ease;
    border-color: #2EBEF2;
    box-shadow: 0 0 5px rgba(46, 190, 242, 0.4);
  }
`;

export const StyledInputMask = styled(ReactInputMask)`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #2EBEF2;
    box-shadow: 0 0 5px rgba(46, 190, 242, 0.4);
  }
`;

export const Button = styled(SharedButton).attrs({ variant: "unstyled" })`
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

export const Divider = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #7a7a7a;
  font-size: 13px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(0, 0, 0, 0.12);
  }
`;

export const GoogleButton = styled(SharedButton).attrs({ variant: "unstyled" })`
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background: #fff;
  color: #222;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    transform: translateY(-1px);
    border-color: #c8c8c8;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }
`;

export const LoginPrompt = styled.div`
  margin-top: 15px;
  font-size: 14px;
  color: #555;
  text-align: center;
  margin-bottom: 50px;

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
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 2fr));
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

export const SuccessOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px;
  box-sizing: border-box;
  background: rgba(8, 15, 27, 0.72);
  backdrop-filter: blur(5px);
`;

export const SuccessDialog = styled(motion.section)`
  width: min(100%, 460px);
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  padding: 30px;
  box-sizing: border-box;
  border: 1px solid var(--color-border-soft);
  border-radius: 18px;
  background: var(--color-surface);
  color: var(--color-text-strong);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
  text-align: center;

  > span {
    color: var(--color-primary);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    font-size: clamp(22px, 5vw, 28px);
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 15px;
    line-height: 1.55;
  }

  ${Button} {
    margin-top: 8px;
  }
`;

export const SuccessIcon = styled.div`
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, #22c55e 16%, var(--color-surface));
  color: #16a34a;
  font-size: 24px;
`;

