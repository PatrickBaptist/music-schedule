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

  button {
    margin-top: 10px;
    padding: 6px 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    background-color: #ffb74d;
    color: #333;

    &:hover {
      background-color: #ffa726;
    }
  }

  button:not(.delete-btn) {
    background-color: #ffb74d;
    color: #333;

    &:hover {
      background-color: #ffa726;
    }
  }

  .delete-btn {
    background-color: #f44336;
    color: white;

    &:hover {
      background-color: #d32f2f;
    }
  }
`;

export const PageTopBar = styled.div`
  width: min(100%, 900px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
  flex-wrap: wrap;
  padding: 0 16px;
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
