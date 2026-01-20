import styled from "styled-components";

export const ContainerEscala = styled.div`
  width: 100%;
  margin-top: 30px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    border-top: 1px solid #444;
  }

  .add-schedule {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 6px;
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

  .escala-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 12px 0;
    gap: 25px;
  }

  .escala-content-escala {
    width: 100%;
    background-color: #161b22;
    border-radius: 10px;
    padding: 20px 30px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    width: 90%;
    max-width: 400px;
    color: #e0e0e0;

    @media (max-width: 478px) {
      max-width: 300px;
    }
  }

  .escala-content-escala p {
    font-size: 16px;
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #333;
    padding-bottom: 6px;
  }

  .escala-content-escala p:last-child {
    border-bottom: none;
  }

  .escala-content-escala strong {
    color: #fff;
    min-width: 90px;
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

  .add-btn {
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
`