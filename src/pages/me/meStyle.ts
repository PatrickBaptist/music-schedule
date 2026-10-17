import { motion } from "framer-motion";
import styled from "styled-components";
import SharedButton from "../../components/buttons/Buttons";

export const ProfilePageContainer = styled.main`
  width: 100%;
  min-height: 100%;
  padding: 28px 16px 48px;
  box-sizing: border-box;

  @media (max-width: 670px) {
    padding: 18px 12px 32px;
  }
`;

export const ProfileTitle = styled(motion.h1)`
  width: min(100%, 980px);
  margin: 0 auto 18px;
  color: var(--color-text-strong);
  font-size: clamp(1.7rem, 3vw, 2.2rem);
  letter-spacing: -0.03em;
`;

export const ProfileList = styled(motion.section)`
  width: min(100%, 980px);
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 22px;
  background: var(--color-surface);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.12);
`;

export const ProfileCover = styled.div`
  height: 150px;
  background:
    radial-gradient(ellipse at 82% 0%, color-mix(in srgb, var(--color-primary) 45%, transparent), transparent 42%),
    linear-gradient(120deg, color-mix(in srgb, var(--color-primary) 24%, var(--color-surface)), var(--color-surface-muted));
  border-bottom: 1px solid var(--color-border-soft);

  @media (max-width: 560px) { height: 112px; }
`;

export const ProfileContent = styled.div`
  padding: 0 34px 30px;

  @media (max-width: 560px) { padding: 0 18px 22px; }
`;

export const ProfileIdentity = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 22px;
  margin-top: -58px;

  @media (max-width: 560px) {
    align-items: center;
    flex-direction: column;
    gap: 10px;
    margin-top: -52px;
    text-align: center;
  }
`;

export const ProfileIdentityText = styled.div`
  min-width: 0;
  padding-bottom: 13px;

  h2 { margin: 0; color: var(--color-text-strong); font-size: clamp(1.45rem, 3vw, 1.9rem); overflow-wrap: anywhere; }
  p { margin: 5px 0 0; color: var(--color-text-muted); }

  @media (max-width: 560px) { padding-bottom: 0; }
`;

export const ProfileMembershipBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 10px;
  padding: 6px 10px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 35%, var(--color-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface));
  color: var(--color-text-strong);
  font-size: 0.82rem;
  font-weight: 650;
`;

export const ProfileDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 28px;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

export const ProfileDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 14px 16px;
  border: 1px solid var(--color-border-soft);
  border-radius: 14px;
  background: var(--color-surface-muted);

  > svg { flex: 0 0 auto; color: var(--color-primary); }
  div { min-width: 0; display: grid; gap: 4px; }
  small { color: var(--color-text-muted); font-size: 0.78rem; }
  strong { color: var(--color-text-strong); font-size: 0.95rem; overflow-wrap: anywhere; }
`;

export const ProfileRoles = styled.section`
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-soft);

  h3 { margin: 0 0 12px; color: var(--color-text-strong); font-size: 1rem; }
  > div { display: flex; flex-wrap: wrap; gap: 8px; }
  > p { margin: 0; color: var(--color-text-muted); font-size: 0.92rem; }
`;

export const ProfileAvatar = styled.div`
  width: 116px;
  height: 116px;
  flex: 0 0 116px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  border: 5px solid var(--color-surface);
  box-shadow: 0 0 0 1px var(--color-border), 0 8px 22px rgba(0, 0, 0, 0.16);
  background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 16%, var(--color-surface)), color-mix(in srgb, var(--color-primary) 30%, var(--color-surface-muted)));
  color: var(--color-primary);
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: 0.04em;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 5px 11px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-muted);
  color: var(--color-text);
  font-size: 0.84rem;
  font-weight: 600;
`;

export const DarkWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const ContainerForm = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  gap: 45px;
  padding: 70px 20px 40px 20px;

  .form-row {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 45px;
  }

  .form-column {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .form-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .form-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .button-container {
    margin-top: auto;
    padding-top: 20px;
    display: flex;
    justify-content: center;
  }

  @media (min-width: 768px) {
    .form-row {
      flex-direction: row;
      justify-content: space-between;
      gap: 25px;
      align-items: stretch;
    }

    .form-column {
      flex: 1;
      display: flex;
    }

    .form-container {
      height: 100%;
    }

    .form-content {
      height: 100%;
    }
  }

  h2 {
    text-align: center;
    margin-bottom: 25px;
    width: 100%;
    font-size: 1.5rem;
    padding-bottom: 10px;
  }
`;

export const DarkForm = styled(motion.form)`
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 18px;
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
  width: 100%;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px 0;
  border-radius: 3px;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #2EBEF2;
    box-shadow: 0 0 5px rgba(0, 62, 234, 0.5);
  }
`;

export const DarkSelect = styled.select`
  width: 100%;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px 0;
  border-radius: 3px;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #2EBEF2;
    box-shadow: 0 0 5px rgba(0, 62, 234, 0.5);
  }
`;

export const DarkButton = styled(SharedButton).attrs({ variant: "unstyled" })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  max-width: 400px;
  background-color: var(--color-primary);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 650;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  padding: 10px 14px;

  &:hover {
    background-color: color-mix(in srgb, var(--color-primary) 84%, black);
    box-shadow: 0 6px 15px color-mix(in srgb, var(--color-primary) 20%, transparent);
  }

  &:focus {
    outline: none;
  }
`;

export const DarkLabel = styled.label`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  letter-spacing: 0.5px;
`;

export const BackButton = styled(DarkButton)`
  background-color: var(--color-text-muted);

  &:hover {
    background-color: var(--color-text-strong);
  }
`;

export const ProfileActions = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-soft);
  gap: 10px;
  flex-wrap: wrap;

  button {
    min-height: 42px;
    min-width: 160px;
  }

  @media (max-width: 480px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;

export const LogoutButton = styled(SharedButton).attrs({ variant: "danger" })`
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.16);

  &:hover:not(:disabled) {
    box-shadow: 0 8px 20px rgba(220, 38, 38, 0.24);
  }
`;

export const CompletionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
`;

export const CompletionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(46, 190, 242, 0.16);
  background: rgba(46, 190, 242, 0.06);
`;

export const CompletionSectionTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  color: var(--color-text-strong);
`;

export const CompletionSectionHint = styled.p`
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.45;
`;

export const CompletionSectionActions = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;
`;

export const EditProfileSection = styled.section`
  width: 100%;
  max-width: 920px;
  margin: 28px auto 0 auto;
  padding: 24px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

export const EditProfileTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  text-align: center;
`;

export const EditProfileHint = styled.p`
  margin: 0 0 18px 0;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.95rem;
`;

export const EditProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const EditProfileField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const EditProfileTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px 0;
  border-radius: 6px;
  transition: all 0.3s ease;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: #2EBEF2;
    box-shadow: 0 0 5px rgba(0, 62, 234, 0.5);
  }
`;

export const EditProfileFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
`;
