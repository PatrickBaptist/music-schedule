import { motion } from "motion/react";
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