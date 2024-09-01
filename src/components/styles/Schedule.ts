import styled from 'styled-components';

export const ScheduleContainer = styled.div`
  width: 100%;
  max-width: 1600px;
  height: 100%;
  background-color: #cde8ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
`;

export const ScheduleContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
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

  h1 {
    margin-top: 100px;
  }

  span {
    width: 100%;
    display: flex;
    gap: 0 10px;

    @media (max-width: 670px) {
      display: grid;
      grid-template-columns: 200px 200px;
      align-items: center;
      justify-content: center;
      gap: 10px;
      overflow-x: hidden;
    }
  }
`;

export const SeeScale = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #b6d8f7;
  
  h3 {
    font-size: 18px;
  }

  p {
    font-size: 16px;
  }
`;