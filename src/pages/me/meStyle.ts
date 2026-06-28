import { motion } from "framer-motion";
import styled from "styled-components";

export const ProfileTitle = styled(motion.h1)`
  font-size: 2.2rem;
  margin-bottom: 25px;
  text-align: center;
`;

export const ProfileList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const ProfileAvatar = styled.div`
  width: 104px;
  height: 104px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px auto;
  border: 3px solid var(--color-primary);
  background: linear-gradient(135deg, rgba(46, 190, 242, 0.12), rgba(15, 142, 196, 0.22));
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

export const ProfileItem = styled(motion.div)`
  font-size: 1.3rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  strong {
    color: var(--color-text);
    font-weight: 600;
    margin-right: 6px;
  }
`;

export const Badge = styled.span`
  background-color: #ff7f50;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  margin-left: 6px;
  margin-top: 4px;
  font-size: 0.9rem;
  display: inline-block;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    background-color: #ff4500;
  }
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

export const DarkButton = styled.button`
  max-width: 400px;
  background-color: #007BFF;
  color: #fff;
  font-size: 13px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  padding: 10px 10px;

  &:hover {
    background-color: #2EBEF2;
    transform: scale(1.05);
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
  justify-content: center;
  margin-top: 24px;
  gap: 12px;
  flex-wrap: wrap;
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
