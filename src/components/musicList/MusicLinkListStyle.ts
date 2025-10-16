import styled from "styled-components";

export const ListContainer = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  box-sizing: border-box;

  .delete-edit {
    display: none;

    @media (max-width: 354px) {
      display: inline-flex;
    }
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

      .btns {
        align-items: center;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-flex;
        font-size: 11px;
        font-weight: 500;
        justify-content: center;
        padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        vertical-align: baseline;
        width: auto;
        height: 14px;
      }

      .delete-icon {
        @media (max-width: 354px) {
          display: none;
        }
      }
    }

    .card {
      width: 100%;
      min-width: 100px;
      background-color: #161b22;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 10px;
      border-radius: 12px;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
      position: relative;
      gap: 12px;

      &:hover {
        transform: translateY(-1px);
        background-color: #f180346b;
        transition: all 0.4s ease-in-out;

        .span-music {
          color: white;
          transition: all 0.4s ease-in-out;
        }
      }
    }

    .music-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      @media (max-width: 600px) {
        gap: 8px;
      }
    }

    .span-music {
      flex: 1;
      font-weight: bold;
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      @media (max-width: 600px) {
        font-size: 14px;
      }
    }

    .span-order {
      font-weight: bold;
      font-size: 20px;
      color: #c9d1d9;
      min-width: 30px;
      text-align: center;

      @media (max-width: 600px) {
        font-size: 18px;
      }
    }

    .span-cifra {
      font-weight: bold;
      font-size: 18px;
      color: #fff;
      min-width: 40px;
      text-align: center;
      padding: 4px 8px;
      border-radius: 6px;

      @media (max-width: 600px) {
        font-size: 16px;
        padding: 3px 6px;
      }
    }

    .menu-buttons {
      width: 100%;
      display: flex;
      gap: 8px;

      @media (max-width: 372px) {
        gap: 4px;
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
      width: 25px;
      height: 25px;
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
      background-color: #ffffff;
      color: #333;
    }

    .letter-btn:hover {
      background-color: #f0f0f0;
    }

    .edit-btn {
      background-color: #2f81f7;
      color: white;
    }

    .edit-btn:hover {
      background-color: #1a6fd8;
    }
  }

  .edit-form {
    width: 100vw;
    height: 100dvh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2024;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .edit-content {
    width: 400px;
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
`;

export const ContainerVd = styled.div`
  width: 100vw;
  height: 100dvh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2024;
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
