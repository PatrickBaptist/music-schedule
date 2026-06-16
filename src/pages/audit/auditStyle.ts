import styled from "styled-components";
import { motion } from "motion/react";

export const AuditPageShell = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 28px 24px 40px;
  box-sizing: border-box;
`;

export const AuditContainer = styled.div`
  width: min(100%, 1120px);
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const AuditHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;

  h1 {
    margin: 0;
    font-size: clamp(1.5rem, 3vw, 2.1rem);
  }

  p {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.5;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 18px;
`;

export const RefreshButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(135deg, #0f8ec4, #2ebef2);
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }
`;

export const AuditList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const AuditCard = styled(motion.article)`
  background: var(--color-surface);
  color: var(--color-text-strong);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);

  @media (min-width: 720px) {
    padding: 18px 20px;
  }

  .who {
    font-size: 1rem;
    font-weight: 700;
  }

  .what {
    font-size: 0.98rem;
    line-height: 1.5;
    color: var(--color-text);
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    font-size: 0.84rem;
    color: var(--color-text-muted);
  }

  .chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(46, 190, 242, 0.1);
    color: #0f8ec4;
    font-weight: 700;
  }
`;

export const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: var(--color-text-muted);
  border: 1px dashed rgba(148, 163, 184, 0.35);
  border-radius: 16px;
`;
