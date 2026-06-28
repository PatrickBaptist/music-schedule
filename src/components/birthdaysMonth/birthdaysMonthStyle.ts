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
  color: var(--color-text-strong);
  font-weight: 700;
`;

export const BirthdayList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const BirthdayCard = styled(motion.div)`
  background: white;
  padding: 16px 18px;
  border-radius: 15px;
  font-size: 1rem;
  font-weight: 500;
  color: #444;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
`;

export const BirthdayAvatar = styled.div`
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 71, 126, 0.2);
  background: linear-gradient(135deg, rgba(255, 154, 158, 0.22), rgba(251, 194, 235, 0.35));
  color: #ff477e;
  font-size: 1.1rem;
  font-weight: 800;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const BirthdayCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  text-align: left;
  min-width: 0;
`;

export const BirthdayName = styled.strong`
  color: #ff477e;
  font-size: 1.05rem;
  line-height: 1.2;
`;

export const BirthdayDate = styled.span`
  color: #666;
  font-size: 0.95rem;
`;
