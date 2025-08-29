import { motion } from "motion/react";
import styled from "styled-components";

export const UsersContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  justify-content: center;
  padding: 40px 0;
`;

export const UserCard = styled(motion.div)`
    width: 80%;
  background-color: #161b22;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 20px;
  border-radius: 12px;

  strong {
    font-size: 1.2rem;
  }

  span {
    font-size: 0.95rem;
    opacity: 0.9;
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
`;