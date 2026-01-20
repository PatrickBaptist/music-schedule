import styled from 'styled-components';

export const ScheduleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 60px 0;
`;

export const ScheduleContent = styled.div`
  width: 100%;
  height: auto;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  h1 {
    margin-bottom: 30px;
    font-family: 'Segoe UI', sans-serif;
    font-weight: 600;
    font-size: 2.2rem;
  }

  .add-schedule {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
    margin-left: 40px;
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

  .btns {
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
`;

export const CardsGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
  padding: 20px;
  box-sizing: border-box;
  justify-items: center;

  @media (max-width: 670px) {
    grid-template-columns: 1fr;
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