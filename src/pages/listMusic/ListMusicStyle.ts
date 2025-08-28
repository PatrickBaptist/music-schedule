import styled from 'styled-components';

export const Container = styled.div`
  height: 100dvh;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  box-sizing: border-box;
`;

export const Main = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 10px;
    background-color: #0e1e30ff;
    border-radius: 1em;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #58a6ff;
    border-radius: 1em;
  }
`;

export const ListContainer = styled.ul`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 100px 0;

  .content-louvores {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: left;
      box-sizing: border-box;
      padding-left: 12px;
      margin: 20px 0;

      h4 {
        margin-right: 10px;
      }

      .btn-write{
        width: 10px;
        border: none;
        background-color: none;
        cursor: pointer;
        transition: transform 0.3s ease;

        &:hover {
          transform: rotate(10deg);
        }
      }

      img {
        width: 15px;
      }

    }
  .container {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 0 50px;
  }

  .container-card-music {
    width: 100%;
    max-width: 800px;
    background-color: #161b22;
    border-radius: 12px;
    padding: 12px 20px;
    margin-bottom: 12px;
    box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
    gap: 10px;

    &:hover {
      transform: translateY(-1px);
      background-color: #f180346b;
      transition: all 0.4s ease-in-out;
    }
  }

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
    padding: calc(.875rem - 1px) calc(1.5rem - 1px);
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: baseline;
    width: auto;
    height: 14px;
  }

  .music-info {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .span-cifra {
    font-weight: bold;
    font-size: 18px;
    color: white;
    width: 60px;
    flex-shrink: 0;
  }

  .music-text {
    display: flex;
    gap: 10px;

    @media (max-width: 500px) {
      flex-direction: column;
    }
  }

  .divider-music {
    @media (max-width: 500px) {
      display: none;
    }
  }

  .span-music {
    font-weight: bold;
    font-size: 16px;
    color: white;
  }

  .span-minister {
    font-size: 14px;
    color: #ccc;
  }

  .music-buttons {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }

  .modal {
      width: 100vw;
      height: 100dvh;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2024;
      background-color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-content {
      width: 400px;
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
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .all-edit-content {
    width: 400px;
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