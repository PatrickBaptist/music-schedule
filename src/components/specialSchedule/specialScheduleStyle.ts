import styled from "styled-components";

export const ContainerEscala = styled.div`
  width: 100%;
  margin-top: 30px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    border-top: 1px solid var(--color-border);
  }

  .escala-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin: 12px 0;
    gap: 18px;

    @media (max-height: 700px) and (max-width: 768px) {
      gap: 14px;
    }
  }

  .empty-schedule {
    width: 100%;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-sizing: border-box;
    padding: 24px;
    border: 1px dashed var(--color-border);
    border-radius: 14px;
    background: var(--color-surface);
    color: var(--color-text-muted);
    text-align: center;

    > svg {
      margin-bottom: 4px;
      color: var(--color-primary);
      font-size: 26px;
    }

    strong {
      color: var(--color-text-strong);
    }

    span {
      font-size: 13px;
      line-height: 1.4;
    }
  }
`;
