import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #06141b;
  box-sizing: border-box;
  overflow: hidden;
`

export const ContainerHome = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
    overflow-y: auto;

    h1 {
        margin: 25px 0;
    }

    p {
        font-size: 20px;
    }

    .container-escala {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 30px;
      background-color: #000;
      border-top: 1px solid #949494;
      padding-bottom: 25px;

        p {
            font-size: 20px;
        }
      
        .content {
          display: flex;
          flex-direction: column;

          p {
            padding: 0;
            margin: 5px;
            padding-left: 25px;
          }
        }
    }

    .content-louvores {
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: center;
      margin: 25px 0;

      h1 {
        margin-right: 10px;
      }

      .btn-write{
        width: 20px;
        border: none;
        background-color: none;
        cursor: pointer;
        transition: transform 0.3s ease;

        &:hover {
          transform: rotate(10deg);
        }
      }

      img {
        width: 20px;
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

        .close-modal {
          cursor: pointer;
        }
      }
    }
`