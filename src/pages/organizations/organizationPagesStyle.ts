import styled from "styled-components";
import SharedButton from "../../components/buttons/Buttons";
import { formCardSurface, formControlStyles } from "../../components/formCard/formCardStyles";

export const Page = styled.main`
  min-height: 100%;
  width: 100%;
  padding: 32px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-page-bg);
`;

export const Card = styled.section`
  ${formCardSurface}

  h1 { margin: 0 0 8px; font-size: 1.5rem; line-height: 1.3; }
  h2 { margin: 24px 0 14px; font-size: 1.1rem; }
  p { color: var(--color-text-muted); line-height: 1.5; overflow-wrap: anywhere; }
  form { display: flex; flex-direction: column; gap: 16px; }
  label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 600; }
  input:not([type="checkbox"]), select, textarea { ${formControlStyles} }
  fieldset {
    margin: 0; padding: 12px; min-width: 0;
    border: 1px solid var(--color-border); border-radius: 10px;
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;
    legend { padding: 0 6px; font-size: 13px; font-weight: 600; }
    label { flex-direction: row; align-items: center; gap: 8px; min-width: 0; padding: 6px; }
    input { width: 18px; height: 18px; flex-shrink: 0; accent-color: var(--color-primary); }
  }
  @media (max-width: 380px) { fieldset { grid-template-columns: 1fr; } }
`;

export const CardActions = styled.div`
  display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
  margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--color-border-soft);
  > button { margin-top: 0; }
`;

export const InvitationItem = styled.div`
  padding: 14px; margin-top: 10px;
  border: 1px solid var(--color-border-soft); border-radius: 10px;
  background: var(--color-surface-muted);
  strong { display: block; overflow-wrap: anywhere; }
  p { margin: 6px 0 10px; font-size: 13px; }
`;

export const OrganizationList = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 24px;
`;

export const OrganizationButton = styled(SharedButton).attrs({ variant: "unstyled" })<{ $active?: boolean }>`
  width: 100%;
  min-height: 68px;
  padding: 14px 16px;
  border: 1px solid ${({ $active }) => $active ? "var(--color-primary)" : "var(--color-border)"};
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
  background: ${({ $active }) => $active ? "var(--color-surface-muted)" : "transparent"};
  color: var(--color-text);
  cursor: pointer;

  &:hover,
  &:focus-visible {
    border-color: var(--color-primary);
  }
`;

export const OrganizationLogo = styled.span`
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--color-surface-muted);
  color: var(--color-primary);
  font-weight: 800;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const OrganizationInfo = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: var(--color-text-strong);
    overflow-wrap: anywhere;
  }

  small {
    color: var(--color-text-muted);
    text-transform: capitalize;
  }
`;

export const PrimaryButton = styled(SharedButton).attrs({ variant: "primary" })`
  width: 100%; min-height: 40px; margin-top: 8px;
`;

export const SecondaryButton = styled(SharedButton).attrs({ variant: "secondary" })`
  min-height: 40px; margin-top: 10px;
`;

export const ErrorMessage = styled.p`
  color: #f85149 !important;
`;

export const InvitationDetails = styled.div`
  margin-top: 22px;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface-muted);

  strong {
    display: block;
    margin-bottom: 6px;
    color: var(--color-text-strong);
    font-size: 1.1rem;
  }

  span {
    color: var(--color-text-muted);
    text-transform: capitalize;
  }
`;
