import styled from 'styled-components';

export const ScheduleContainer = styled.div`
  width: 100%;
  height: 100dvh;
  background-color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-top: 60px;
  overflow-y: auto;

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

export const ScheduleContent = styled.div`
  width: 100%;
  height: auto;
  max-width: 1012px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;

  h1 {
    margin-bottom: 30px;
    color: #58a6ff;
    font-family: 'Segoe UI', sans-serif;
    font-weight: 600;
    font-size: 2.2rem;
  }

  span {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    @media (max-width: 670px) {
      justify-content: center;
    }
  }
`;

export const SeeScale = styled.div`
  background-color: #161b22;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.6);
  padding: 20px 25px;
  width: 280px;
  color: #e0e0e0;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 8px;

  h3 {
    font-size: 1.1rem;
    color: #58a6ff;
    margin-bottom: 12px;
  }

  p {
    font-size: 1rem;
    margin: 0;
    display: flex;
    justify-content: flex-start;
    gap: 6px;
  }

  strong {
    min-width: 70px;
    color: #fff;
  }

  &:hover {
    background-color: #f180346b;
    transition: all 0.4s ease-in-out;
  }
`;