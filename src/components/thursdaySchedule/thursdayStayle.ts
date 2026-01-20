import styled from "styled-components";
import { motion } from "framer-motion";

export const ContainerThursday = styled.div`
  width: 100%;

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 12px 0;
  }
`;

export const CardThursday = styled(motion.div)`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 8px 0;

  .content-escala {
    width: 90%;
    max-width: 400px;
    background-color: #161b22;
    border-radius: 10px;
    padding: 20px 30px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    color: #e0e0e0;

    @media (max-width: 478px) {
      max-width: 300px;
      padding: 15px 20px;
    }
  }

  .content-escala p {
    font-size: 16px;
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #333;
    padding-bottom: 6px;
    transition: all 0.3s ease-in-out;
  }

  .content-escala p:last-child {
    border-bottom: none;
  }

  .content-escala strong {
    color: #fff;
    min-width: 90px;
    text-align: left;
  }

  .content-escala span {
    text-align: right;
    flex: 1;
    color: #e0e0e0;
  }
`;

export const MinisterInfo = styled.span`
  display: inline-block;
  color: #e0e0e0;
  font-weight: 600;
`;