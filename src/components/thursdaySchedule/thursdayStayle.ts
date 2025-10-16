import styled from "styled-components";
import { motion } from "framer-motion";

export const ContainerThursday = styled.div`
  margin: 20px auto;
  max-width: 420px;
  padding: 20px;
  border-radius: 16px;
  background: #000;
  color: #2ebef2;
  text-align: center;
`;

export const CardThursday = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-radius: 12px;
  margin: 10px 0;
  font-weight: bold;
  border-bottom: 1px solid #2ebef2;
  transition: all 0.2s ease;

  .date {
    font-size: 0.95rem;
    color: #c4c4c4;
    font-weight: 600;
  }

  &:hover {
    transform: translateY(-3px);
  }
`;

export const MinisterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    font-size: 1rem;
    font-weight: 700;
    color: #c4c4c4;
  }
`;

