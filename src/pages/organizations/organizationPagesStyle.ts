import styled from "styled-components";
import SharedButton from "../../components/buttons/Buttons";

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
  width: min(100%, 560px);
  padding: 32px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
  box-shadow: 0 18px 50px var(--color-shadow);

  h1 {
    margin: 0 0 8px;
    font-size: clamp(1.5rem, 5vw, 2rem);
  }

  p {
    color: var(--color-text-muted);
    line-height: 1.5;
  }

  @media (max-width: 520px) {
    padding: 24px 18px;
  }
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
  }

  small {
    color: var(--color-text-muted);
    text-transform: capitalize;
  }
`;

export const PrimaryButton = styled(SharedButton).attrs({ variant: "unstyled" })`
  width: 100%;
  margin-top: 20px;
  padding: 12px 16px;
  border: 0;
  border-radius: 10px;
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

export const SecondaryButton = styled(SharedButton).attrs({ variant: "unstyled" })`
  margin-top: 14px;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font-weight: 600;
  cursor: pointer;
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
