import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

export const LoadingOverlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

export const DotAnimation = keyframes`
  0%, 20% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(-5px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.3; }
`;

export const Dot = styled(motion.span)`
  font-size: 1,5rem;
  margin: 0 1px;
  animation: ${DotAnimation} 0.6s infinite;
`;

export const LoadingText = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
`;