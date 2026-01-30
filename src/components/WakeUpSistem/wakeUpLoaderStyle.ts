import styled from "styled-components";

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #000;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
`;

export const Content = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
`;

export const ContainerLogo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;

  .logo {
    width: 190px;
    height: 110px;
  }
`;

export const BarraContent = styled.div`
    width: 250px;
    height: 8px;
    background-color: #222;
    border-radius: 4px;
    overflow: hidden;
`;