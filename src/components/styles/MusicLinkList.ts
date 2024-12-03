import styled from 'styled-components';

export const ListContainer = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  box-sizing: border-box;

    .container-list {
      width: 60%;
      display: flex;
      align-items: center;
      font-weight: bold;
      box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px;

      @media(max-width: 900px) {
        width: 100%;
      }

      span {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 18px;
      }

      .span-name{
        font-weight: bold;
        font-size: 20px;
        color: white;
        margin-left: 30px;
      }
    }

    .container-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: end;
      
      button {
        cursor: pointer;
        margin: 2px;
      }

      img {
        width: 20px;
      }
    }

    .menu-buttons {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;

      @media(max-width: 520px) {
        justify-content: center;
      }
    }

  .edit-form{
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
      outline:  none;
      padding: 6px;
    }
  }
`

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