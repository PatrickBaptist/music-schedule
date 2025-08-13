import styled from 'styled-components'

export const Container = styled.div`
  width: 100vw;
  height: 100dvh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #000;
  box-sizing: border-box;
  overflow: hidden;
`

export const ContainerHome = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60px;
    overflow-y: auto;
    box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 10px;
    background-color: #0e1e30ff;
    border-radius: 1em;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #58a6ff; // azul claro parecido com home
    border-radius: 1em;
  }

    .container-escala {
      width: 100%;
      margin-top: 30px;
      border-top: 1px solid #444;
      padding-top: 20px;
      color: #e0e0e0;
      font-family: 'Segoe UI', sans-serif;

      h4 {
        margin-left: 16px;
        font-size: 18px;
        color: #00bfff; // Azul claro
        font-weight: 600;
      }

      .content {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 12px 0;
      }

      .content-escala {
        width: 100%;
        background-color: #161b22; // Fundo escuro suave
        border-radius: 10px;
        padding: 20px 30px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
        width: 90%;
        max-width: 400px;

        @media (max-width: 478px) {
          max-width: 300px;
        }
      }

      .content-escala p {
        font-size: 16px;
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #333;
        padding-bottom: 6px;
      }

      .content-escala p:last-child {
        border-bottom: none;
      }

      .content-escala strong {
        color: #fff;
        min-width: 90px;
      }
    }

    .content-louvores {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: left;
      box-sizing: border-box;
      padding-left: 12px;
      margin-top: 20px;

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

    .modal {
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
`