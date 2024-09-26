import styled from 'styled-components';

export const ListContainer = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  list-style-type: none;
  font-size: 16px;
  padding: 0 10px;
  box-sizing: border-box;

    .container-list {
      width: 60%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;
      box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px;

      @media(max-width: 900px) {
        width: 100%;
      }

      li {
        width: 620px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 18px;
      }
    }

    .container-btn {
      width: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      button {
        cursor: pointer;
        margin: 2px;
      }

      img {
        width: 20px;
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