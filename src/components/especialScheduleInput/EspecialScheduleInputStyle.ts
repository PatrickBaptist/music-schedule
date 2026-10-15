import styled from 'styled-components';
import { formCardSurface, formControlStyles } from '../formCard/formCardStyles';

export const ContainerForm = styled.div`
  ${formCardSurface}
  width: 100%;
  max-width: 620px;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  margin: 0;
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: 18px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 620px;
    max-height: 100%;
    padding: 16px;
  }

   /* Layout para mobile (default) */
  .form-row {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 45px;
  }

  .form-column {
    min-height: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .form-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
    height: 100%;
  }

  .form-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 0;
    overflow: hidden;
  }

  .button-container {
    width: 100%;
    margin-top: 0;
    padding-top: 12px;
    display: flex;
    justify-content: space-around;
    gap: 10px;
    flex: 0 0 auto;
  }

  /* Media query para desktop */
  @media (min-width: 768px) {
    .form-row {
      flex-direction: row;
      justify-content: space-between;
      gap: 25px;
      align-items: stretch; /* Crucial para alinhar a altura */
    }

    .form-column {
      flex: 1;
      display: flex;
    }

    .form-container {
      height: 100%;
    }

    /* Garante que os formulários ocupem toda a altura */
    .form-content {
      height: 100%;
    }
  }

  h2 {
    text-align: center;
    margin: 0;
    width: 100%;
    font-size: 1.5rem;
    padding-bottom: 4px;
    color: var(--color-text-strong);
  }

  .schedule-more-options {
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 11px 12px;
    background: var(--color-surface-muted);

    summary {
      cursor: pointer;
      color: var(--color-primary);
      font-weight: 700;
    }

    .schedule-more-options-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 14px;
    }

    textarea {
      ${formControlStyles}
      min-height: 84px;
      resize: vertical;
      font: inherit;
    }
  }

  .schedule-roles-section {
    display: flex;
    flex-direction: column;
    gap: 12px;

    h3 {
      margin: 0;
      color: var(--color-text-strong);
      font-size: 15px;
    }

    p {
      margin: -8px 0 0;
      color: var(--color-text-muted);
      font-size: 13px;
    }
  }
`;

export const DarkForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  max-height: 100%;
  gap: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  min-height: 0;
  scrollbar-gutter: stable;
`;

export const DarkTitle = styled.h1`
  text-align: center;
`;
  
export const FormGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const DarkInput = styled.input`
  ${formControlStyles}
`;

export const DarkSelect = styled.select`
  ${formControlStyles}
`;

export const DarkLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 5px;
  letter-spacing: 0.5px;
`;

