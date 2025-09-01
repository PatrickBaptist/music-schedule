import styled from "styled-components";
import { motion } from "framer-motion";

export const BirthdayContainer = styled(motion.div)`
  background: linear-gradient(135deg, #ff9a9e, #fad0c4, #fbc2eb, #a18cd1);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  overflow: hidden;
  margin: 50px 0;
`;

export const Title = styled.h4`
  font-size: 1.8rem;
  color: #fff;
  font-weight: 700;
`;

export const BirthdayList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const BirthdayCard = styled(motion.div)`
  background: white;
  padding: 15px 20px;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);

  strong {
    color: #ff477e;
  }
`;