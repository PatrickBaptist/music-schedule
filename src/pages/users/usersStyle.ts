import { motion } from "motion/react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  &:focus {
    border-color: #2EBEF2;
    box-shadow: 0 0 5px rgba(0, 62, 234, 0.5);
  }
`;

export const UsersContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;
  padding: 20px;
  box-sizing: border-box;

  /* Tablet */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Desktop */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const UserCard = styled(motion.div)`
  background-color: var(--color-surface);
  color: var(--color-text-strong);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 20px;
  border-radius: 12px;
  box-sizing: border-box;

  strong {
    font-size: 1.2rem;
  }

  span {
    font-size: 0.95rem;
    opacity: 0.9;
  }

  .actions-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }
`;

export const CardActionButton = styled.button`
  && {
  margin-top: 10px;
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  background: linear-gradient(135deg, #2ebef2, #0f8ec4);
  color: #fff;

  &:hover {
    filter: brightness(1.05);
  }
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(8, 15, 24, 0.68);
  backdrop-filter: blur(8px);
  overflow-y: auto;
  overscroll-behavior: contain;

  @media (max-width: 720px) {
    align-items: flex-start;
    padding: 82px 12px 106px;
  }
`;

export const ModalContent = styled(motion.div)`
  width: min(100%, 620px);
  max-height: min(92vh, 760px);
  overflow: hidden;
  border-radius: 20px;
  background: var(--color-surface);
  color: var(--color-text-strong);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: 720px) {
    width: 100%;
    max-height: calc(100dvh - 188px);
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  h2 {
    margin: 0;
    font-size: 1.3rem;
  }

  p {
    margin: 6px 0 0;
    opacity: 0.75;
    line-height: 1.4;
  }
`;

export const CloseButton = styled.button`
  border: none;
  border-radius: 999px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.08);
  color: inherit;
  font-size: 1.1rem;

  &:hover {
    background: rgba(0, 0, 0, 0.14);
  }
`;

export const ModalBody = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;

  @media (max-width: 720px) {
    max-height: calc(100dvh - 188px - 90px);
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldLabel = styled.label`
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-text-strong);
`;

const fieldBase = `
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 0.98rem;
  outline: none;
  background: rgba(255, 255, 255, 0.95);
  color: #111827;

  &:focus {
    border-color: #2ebef2;
    box-shadow: 0 0 0 3px rgba(46, 190, 242, 0.18);
  }
`;

export const TextInput = styled.input`
  ${fieldBase}
`;

export const SelectField = styled.select`
  ${fieldBase}
`;

export const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
`;

export const RoleChip = styled.label<{ $checked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid ${({ $checked }) => ($checked ? "#2ebef2" : "rgba(0,0,0,0.12)")};
  background: ${({ $checked }) => ($checked ? "rgba(46, 190, 242, 0.12)" : "rgba(255,255,255,0.96)")};
  cursor: pointer;
  font-size: 0.94rem;
  color: #111827;

  input {
    width: 16px;
    height: 16px;
    accent-color: #2ebef2;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 4px;
`;

export const FooterButton = styled.button`
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 800;
  cursor: pointer;
`;

export const PrimaryActionButton = styled(FooterButton)`
  background: linear-gradient(135deg, #2ebef2, #0f8ec4);
  color: #fff;
`;

export const DangerActionButton = styled(FooterButton)`
  background: #ef4444;
  color: #fff;
`;

export const PageTopBar = styled.div<{ $centerTitle?: boolean }>`
  width: min(100%, 900px);
  display: flex;
  justify-content: ${({ $centerTitle }) => ($centerTitle ? "center" : "space-between")};
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
  flex-wrap: wrap;
  padding: 0 16px;

  h1 {
    margin: 0;
  }
`;

export const AuditLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #0f8ec4, #2ebef2);
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;
