import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  max-width: 1600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #cde8ff;
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
      background-color: #b6d8f7;
      border-top: 1px solid #949494;
      padding-bottom: 25px;

        p {
            font-size: 20px;
        }
      
        .content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;

          p {
            padding: 0;
            margin: 5px;
          }
        }
    }
`