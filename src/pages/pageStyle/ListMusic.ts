import styled from 'styled-components';

export const ContainerMusic = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #cde8ff;
  box-sizing: border-box;
  overflow: hidden;

  h1 {
    margin-top: 100px;
  }
`

export const ContentMusic = styled.div`
    width: 100%;
    max-width: 1600px;
    height: 100%;
    display: flex;
    justify-content: space-around;
    overflow: auto;

    &::-webkit-scrollbar {
        width: 10px;
        background-color: #fff;
        border-radius: 1em;
    }

    &::-webkit-scrollbar-button {
        display: none;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #7fc3ff;
        border-radius: 1em;
    }

    div {
        width: 100%;
        height: 600px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;

        ul {
            width: 500px;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow-y: auto;
            background-color: #b6d8f7;
            list-style: none;

            span {
                width: 80%;
                display: flex;
                align-items: center;
                margin: 10px 0;
                padding: 0;
            }

            &::-webkit-scrollbar {
                width: 10px;
                background-color: #fff;
                border-radius: 1em;
            }

            &::-webkit-scrollbar-button {
                display: none;
            }

            &::-webkit-scrollbar-thumb {
                background-color: #7fc3ff;
                border-radius: 1em;
            }

            @media (max-width: 1082px) {
                width: 400px;
            }

            @media (max-width: 1005px) {
                width: 300px;
            }

            @media (max-width: 680px) {
                width: 100%;
            }

            @media (max-width: 400px) {
                width: 100%;
            }
        }
    }

    @media (max-width: 680px) {
        flex-direction: column;
    }
`