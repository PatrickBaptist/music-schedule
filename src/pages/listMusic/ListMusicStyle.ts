import { motion } from "framer-motion";
import styled from 'styled-components';
import SharedButton from '../../components/buttons/Buttons';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const Main = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

export const ListContainer = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 36px 0;

  .library-toolbar {
    width: min(calc(100% - 32px), 800px);
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;

    input {
      flex: 1;
      min-width: 0;
    }

    button {
      flex-shrink: 0;
      white-space: nowrap;
    }

    @media (max-width: 560px) {
      align-items: stretch;
      flex-direction: column;

      button {
        width: 100%;
      }
    }
  }

  .container {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 0 16px;
  }

  .container-card-music {
    width: 100%;
    max-width: 800px;
    background-color: var(--color-surface);
    padding: 14px 16px;
    margin-bottom: 8px;
    box-sizing: border-box;
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 10px;
    box-shadow: 0 2px 8px var(--color-shadow);
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        border-color: rgba(245, 158, 11, 0.45);
        box-shadow: 0 5px 14px var(--color-shadow);
      }
    }

    @media (max-width: 600px) {
      padding: 12px;
      border-radius: 9px;
    }
  }

  .music-card-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .music-card-copy {
    min-width: 0;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 3px;

    strong {
      color: var(--color-text-strong);
      font-size: 17px;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }

    span {
      color: var(--color-text-muted);
      font-size: 13px;
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
    width: 38px;
    min-height: 34px;
    transition: all 0.3s ease;
  }

  .youtube-btn {
      background-color: #C0392B;
      color: white;
    }

    .youtube-btn:hover {
      background-color: #cc0000;
    }
    
    .spotify-btn {
      background-color: #1db954;
      color: white;
    }

    .spotify-btn:hover {
      background-color: #1aa34a;
    }

    .letter-btn {
      background-color: #333;
      color: white;
    }

    .edit-btn {
      background-color: #2f81f7;
      color: white;
    }

    .edit-btn:hover {
      background-color: #1a6fd8;
    }

    .delete-btn {
      background-color: #cc0000 !important;
      color: white;
    }

    .delete-btn:hover {
      background-color: #A93226 !important;
    }

    .add-btn {
      background-color: #1db954;
      color: white;
    }

    .add-btn:hover {
      background-color: #1aa34a;
    }

  .span-cifra {
    flex-shrink: 0;
    font-weight: bold;
    font-size: 15px;
    color: var(--color-text-strong);
    min-width: max-content;
    padding: 4px 7px;
    border-radius: 6px;
    background: rgba(148, 163, 184, 0.12);
    text-align: center;
    white-space: nowrap;
  }

  .toggle-btn {
    width: 34px;
    min-width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 8px;
    color: var(--color-text-strong);

    &:hover {
      background: var(--color-surface-muted);
    }
  }

  .description-preview {
    width: 100%;
    padding: 8px 10px;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 8px;
    background: var(--color-surface-muted);
    color: var(--color-text-muted);
    font-size: 13px;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .desktop-music-links {
    width: 100%;
    display: flex;
    gap: 8px;

    button {
      min-height: 34px;
      font-size: 13px;
    }

    button:first-child svg {
      color: #dc2626;
    }

    @media (max-width: 600px) {
      display: none;
    }
  }

  .music-buttons {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
    overflow: hidden;
  }

  @media (min-width: 601px) {
    .mobile-link-action {
      display: none;
    }
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
      padding: 200px 0;
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

  .all-edit-form{
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
    padding: 200px 0;
    box-sizing: border-box;
    overflow: auto;
  }

  .all-edit-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .all-input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;

    input {
      width: 350px;
      height: 25px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px 0;
      outline:  none;
      padding: 6px;
      font-size: 16px;

      &:focus {
        border-color: #2EBEF2;
        box-shadow: 0 0 5px rgba(0, 62, 234, 0.5);
      }
    }
  }
`

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  &:focus {
    border-color: #2EBEF2;
    box-shadow: 0 0 5px rgba(0, 62, 234, 0.5);
  }
`;

export const ContainerVd = styled.div`
    width: 100vw;
    height: 100dvh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2024;
`

export const ContentVd = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;

    .loading-screen {
      width: 560px;
      height: 315px;
      background-color: #000000;
      display: flex;
      justify-content: center;
      align-items: center;
    }
`

export const CloseButton = styled(SharedButton).attrs({ variant: "unstyled" })`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 15%;
  right: 15%;
  background: #fff;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #000;
  padding: 5px;
  border-radius: 50%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f1f1f1;
  }

  .btn-close {
    width: 45px;
    height: 45px;
  }
`;

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;

  label {
    font-size: 14px;
    font-weight: bold;
  }

  select {
    width: 350px;
    height: 35px;
    padding: 6px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px 0;
    outline: none;
    font-size: 14px;
  }
`;

export const AddFormOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-modal) + 20);
  background: rgba(8, 15, 24, 0.68);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
  overscroll-behavior: contain;

  @media (max-width: 720px) {
    align-items: flex-start;
    padding: 82px 12px 106px;
  }
`;
