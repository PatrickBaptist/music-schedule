import styled from "styled-components";

export const ListContainer = styled.ul<{ bg?: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  box-sizing: border-box;

  .delete-edit {
    display: inline-flex;
  }

  .container-list {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 4px;
    touch-action: pan-y;

    &.is-dragging {
      opacity: 0.45;
      z-index: 0;
    }

    .container-card {
      width: 100%;
      max-width: 800px;
      height: auto;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      gap: 6px;
    }

    .drag-handle {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      min-width: 32px;
      min-height: 44px;
      padding: 8px 4px;
      color: var(--color-text-muted);
      cursor: grab;
      background: transparent;
      border: none;
      border-radius: 6px;
      touch-action: none;

      &:hover {
          color: #f59e0b;
        background: rgba(255, 255, 255, 0.08);
      }

      &:active {
        cursor: grabbing;
      }
    }

    .card {
      width: 100%;
      min-width: 100px;
      height: auto;
      background-color: var(--color-surface);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 14px 16px;
      border: 1px solid rgba(148, 163, 184, 0.18);
      border-radius: 10px;
      box-shadow: 0 2px 8px var(--color-shadow);
      position: relative;
      gap: 10px;
      touch-action: pan-y;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      @media (hover: hover) and (pointer: fine) {
        &:hover {
          border-color: rgba(245, 158, 11, 0.45);
          box-shadow: 0 5px 14px var(--color-shadow);
        }
      }

      .icon-description {
        cursor: pointer;
        margin-left: 8px;
        color: #d4d4d4;
        transition: color 0.2s ease, transform 0.2s ease;
      }

      .icon-description:hover {
        color: #2EBEF2;
        transform: scale(1.2);
      }

      @media (max-width: 600px) {
        padding: 12px;
        border-radius: 9px;
      }
    }

    .music-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      position: relative;
      box-sizing: border-box;

      .span-music {
        min-width: 0;
        align-items: center;
      }

      @media (max-width: 600px) {
        gap: 8px;
      }
    }

    .span-name {
      flex: 1;
      min-width: 0;
      font-weight: bold;
      font-size: 17px;
      line-height: 1.3;
      white-space: normal;
      overflow-wrap: anywhere;
      word-break: normal;

      @media (max-width: 600px) {
        font-size: 16px;
      }
    }

    .span-order {
      font-weight: bold;
      font-size: 16px;
      min-width: 30px;
      text-align: center;
      color: #f59e0b;

      @media (max-width: 600px) {
        font-size: 15px;
      }
    }

    .span-cifra {
      flex-shrink: 0;
      font-weight: bold;
      font-size: 15px;
      color: var(--color-text-strong);
      min-width: max-content;
      text-align: center;
      padding: 4px 7px;
      background: rgba(148, 163, 184, 0.12);
      white-space: nowrap;
      border-radius: 6px;

      @media (max-width: 600px) {
        font-size: 14px;
        padding: 3px 6px;
      }
    }

    .menu-buttons {
      width: 100%;
      display: flex;
      gap: 12px;
      overflow: hidden;

      @media (max-width: 372px) {
        gap: 10px;
      }
    }

    .btns {
      align-items: center;
      border: none;
      border-radius: 8px;
      box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      font-size: 11px;
      font-weight: 500;
      justify-content: center;
      padding: 8px;
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
      background-color: #333333ff;
      color: #fff;
    }

    .edit-btn {
      background-color: #2f81f7;
      color: #fff;
    }

    .edit-btn:hover {
      background-color: #1a6fd8;
    }

    .delete-icon {
      background-color: #C0392B;
      color: #fff;
    }
  }

  .toggle-btn {
    background-color: transparent !important;
    color: var(--color-text-strong) !important;
    margin-left: 8px;
  }

  .edit-form {
    width: 100vw;
    height: 100dvh;
    position: fixed;
    inset: 0;
    z-index: var(--z-modal);
    background-color: rgba(8, 15, 24, 0.68);
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
  }

  .edit-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-height: calc(100dvh - 32px);
    overflow: hidden;

    @media (max-width: 720px) {
      max-height: calc(100dvh - 188px);
    }
  }

  .input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 0;
    width: 100%;
    max-width: 620px;
    max-height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 20px;
    border-radius: 18px;
    background: var(--color-surface);
    color: var(--color-text-strong);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);

    input {
      width: 100%;
      min-height: 40px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px 0;
      outline: none;
      padding: 6px;
      font-size: 16px;

      &:focus {
        border-color: #2ebef2;
        box-shadow: 0 0 5px rgba(0, 62, 234, 0.5);
      }
    }

    textarea,
    select {
      width: 100%;
    }
  }

  .description-modal {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    background: rgba(8, 15, 24, 0.68);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
    padding: 16px;
    box-sizing: border-box;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .modal-content {
    padding: 24px;
    width: min(100%, 560px) !important;
    max-height: calc(100dvh - 32px);
    height: auto;
    overflow-y: auto;
    text-align: left;
    background: var(--color-surface);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
  }

  .modal-content h3 {
    margin-top: 0;
    margin-bottom: 16px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .modal-text {
    width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 1rem;
    line-height: 1.5;
    flex: 1;
    overflow-y: auto;
    margin: 0;
    padding: 8px 0;
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;
  }

  .modal-text::-webkit-scrollbar {
    width: 6px;
  }

  .modal-text::-webkit-scrollbar-track {
    background: transparent;
  }

  .modal-text::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }

  .close-btn {
    margin-top: 16px;
    padding: 8px 16px;
    background: #9e9e9e;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    align-self: flex-end;
  }

  .close-btn:hover {
    background: #c2c2c2ff;
  }
`;

export const MusicGroup = styled.div<{ $bg?: string; $isOver?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 8px;
  margin-bottom: 12px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg || "transparent"};
  outline: ${({ $isOver }) =>
    $isOver ? "2px dashed rgba(245, 158, 11, 0.8)" : "2px dashed transparent"};
  transition: outline-color 0.2s ease;
  min-height: ${({ $isOver }) => ($isOver ? "48px" : "auto")};
`;

export const ContainerVd = styled.div`
  width: 100vw;
  height: 100dvh;
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  background-color: rgba(0, 0, 0, 0.8);
`;

export const ContentVd = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
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
`;

export const CloseButton = styled.button`
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
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;

  label {
    font-size: 14px;
    font-weight: bold;
  }

  select {
    width: 100%;
    height: 35px;
    padding: 6px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px 0;
    outline: none;
    font-size: 14px;

    @media (max-width: 400px) {
      height: 30px
    }
  }
`;
