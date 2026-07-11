import styled from "styled-components";
import { motion } from "framer-motion";

export const BirthdayContainer = styled(motion.div)`
  background: linear-gradient(135deg, #ff9a9e, #fad0c4, #fbc2eb, #a18cd1);
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  overflow: hidden;
  width: min(100% - 32px, 720px);
  box-sizing: border-box;
  margin: 18px auto 0;

  @media (min-width: 768px) {
    padding: 18px;
  }
`;

export const Title = styled.h4`
  font-size: 1.15rem;
  color: var(--color-text-strong);
  font-weight: 700;
`;

export const BirthdayList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  @media (min-width: 620px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const BirthdayCard = styled(motion.div)`
  background: white;
  padding: 11px 12px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  color: #444;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
`;

export const BirthdayAvatar = styled.div`
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 71, 126, 0.2);
  background: linear-gradient(135deg, rgba(255, 154, 158, 0.22), rgba(251, 194, 235, 0.35));
  color: #ff477e;
  font-size: 0.95rem;
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
  font-size: 0.95rem;
  line-height: 1.2;
`;

export const BirthdayDate = styled.span`
  color: #666;
  font-size: 0.85rem;
`;
