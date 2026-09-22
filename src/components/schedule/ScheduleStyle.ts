import { motion } from 'framer-motion';
import styled from 'styled-components';

export const ScheduleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 60px 0;

  @media (max-height: 700px) and (max-width: 768px) {
    padding: 24px 0;
  }
`;

export const ScheduleContent = styled.div`
  width: 100%;
  height: auto;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  h1 {
    margin-bottom: 30px;
    font-family: 'Segoe UI', sans-serif;
    font-weight: 600;
    font-size: 2.2rem;
  }

  .add-schedule {
    width: min(calc(100% - 40px), 1080px);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 0 auto;
  }

  .modal {
    width: 100vw;
    height: 100dvh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2024;
    background-color: var(--color-modal-bg);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 20px 0 100px 0;
    box-sizing: border-box;
    overflow: auto;
  }

  .modal-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .btn-close {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: end;
      margin-bottom: 10px;

      button {
        background-color: #ffc107;
      }

      .close-modal {
        cursor: pointer;
      }
    }
  }

  .btns {
    align-items: center;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    font-size: 11px;
    font-weight: 500;
    justify-content: center;
    padding: 10px;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: baseline;
    width: 40px;
    height: 10px;
    transition: all 0.3s ease;
  }

  .add-btn {
    background-color: #1db954;
    color: white;
  }

  .add-btn:hover {
    background-color: #1aa34a;
  }

  .btns:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    transform: none !important;
  }
`;

export const CardsGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  align-items: start;
  gap: 18px;
  padding: 20px;
  box-sizing: border-box;
  justify-items: center;

  @media (max-width: 670px) {
    grid-template-columns: 1fr;
  }

  @media (max-height: 700px) and (max-width: 768px) {
    padding: 12px;
  }
`;

export const ViewToggle = styled.div`
  display: inline-flex;
  gap: 4px;
  margin: 22px auto 4px;
  padding: 4px;
  border: 1px solid var(--color-border-soft);
  border-radius: 10px;
  background: var(--color-surface);

  button.active,
  button[aria-pressed='true'] {
    background: var(--color-primary);
    color: var(--color-on-primary);
  }
`;

export const MonthNavigation = styled.div`
  width: min(calc(100% - 40px), 1080px);
  display: grid;
  grid-template-columns: 42px 1fr 42px;
  align-items: center;
  gap: 10px;
  margin: -12px auto 12px;

  strong {
    color: var(--color-text-strong);
    font-size: 1.05rem;
    text-align: center;
    text-transform: capitalize;
  }
`;

export const GenerationPanel = styled.section`
  width: min(calc(100% - 40px), 1080px);
  margin: 14px auto 0;
  padding: 16px;
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(240px, auto) auto;
  align-items: end;
  gap: 16px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 45%, var(--color-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--color-primary) 7%, var(--color-surface));

  > div:first-child {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  strong {
    color: var(--color-text-strong);
  }

  span {
    color: var(--color-text-muted);
    font-size: 0.84rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: var(--color-text-muted);
    font-size: 0.8rem;
    font-weight: 700;
  }

  select {
    min-height: 38px;
    padding: 0 10px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
  }

  .generation-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    align-items: stretch;

    .generation-actions {
      justify-content: stretch;

      button {
        flex: 1;
      }
    }
  }
`;

export const AddFormOverlay = styled(motion.div)`
  position: fixed;
  top: 70px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9998;
  background: rgba(8, 15, 24, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
  overscroll-behavior: contain;

  @media (max-width: 720px) {
    bottom: 90px;
    padding: 12px;
  }
`;
