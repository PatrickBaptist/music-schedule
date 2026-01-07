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
    margin-bottom: 5px;

    .container-card {
      width: 100%;
      max-width: 800px;
      height: auto;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      gap: 8px;

    }

    .card {
      width: 100%;
      min-width: 100px;
      height: auto;
      background-color: #161b22;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
      position: relative;
      gap: 12px;
      cursor: pointer;

      &:hover {
        transform: translateY(-1px);
        transition: all 0.4s ease-in-out;

        .span-music {
          color: white;
          transition: all 0.4s ease-in-out;
        }
      }

      .icon-description {
        cursor: pointer;
        margin-left: 8px;
        color: #d4d4d4;
        transition: color 0.2s ease, transform 0.2s ease;
      }

      .icon-description:hover {
        color: #6659b0; /* muda pra sua cor principal */
        transform: scale(1.2);
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

      @media (max-width: 600px) {
        gap: 8px;
      }
    }

    .span-name {
      flex: 1;
      width: 100px;
      font-weight: bold;
      font-size: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      @media (max-width: 600px) {
        font-size: 18px;
      }
    }

    .span-order {
      font-weight: bold;
      font-size: 20px;
      min-width: 30px;
      text-align: center;
      color: #f59e0b;

      @media (max-width: 600px) {
        font-size: 18px;
      }
    }

    .span-cifra {
      font-weight: bold;
      font-size: 20px;
      color: #fff;
      min-width: 40px;
      text-align: center;
      padding: 4px 8px;
      border-radius: 6px;

      @media (max-width: 600px) {
        font-size: 18px;
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
      width: 45px;
      height: 15px;
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
    color: white !important;
    margin-left: 8px;
  }

  .edit-form {
    width: 100vw;
    height: 100dvh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2024;
    background-color: #000;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 200px 0;
    box-sizing: border-box;
    overflow: auto;
  }

  .edit-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .input-container {
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
      outline: none;
      padding: 6px;
      font-size: 16px;

      &:focus {
        border-color: #2ebef2;
        box-shadow: 0 0 5px rgba(0, 62, 234, 0.5);
      }
    }
  }

  .description-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 20px;
    box-sizing: border-box;
  }

  .modal-content {
    padding: 24px;
    width: auto !important;
    max-height: 50vh;
    height: auto;
    overflow-y: auto;
    text-align: left;
    background: #fff;
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
    width: auto;
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

export const MusicGroup = styled.div<{ $bg?: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 8px;
  margin-bottom: 12px;
  border-radius: 5px;
  background: ${({ $bg }) => $bg || "transparent"};
`;

export const ContainerVd = styled.div`
  width: 100vw;
  height: 100dvh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2024;
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
