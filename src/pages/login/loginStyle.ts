import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  width: 100%;
`;

export const FormWrapper = styled.form`
  padding: 40px 30px;
  border: none;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const Logo = styled.img`
  width: 180px;
  margin-bottom: 20px;
  object-fit: cover;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  &:focus {
        border-color: #2EBEF2;
        box-shadow: 0 0 5px rgba(0, 62, 234, 0.5);
    }
`;

export const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007BFF;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background-color: rgba(0, 62, 234, 0.5);
  }
`;

export const Divider = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #7a7a7a;
  font-size: 13px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(0, 0, 0, 0.12);
  }
`;

export const GoogleButton = styled.button`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background: #fff;
  color: #222;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    transform: translateY(-1px);
    border-color: #c8c8c8;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }
`;

export const RegisterPrompt = styled.div`
  margin-top: 15px;
  font-size: 14px;
  color: #555;
  text-align: center;

  a {
    color: #2EBEF2;
    font-weight: 600;
    text-decoration: none;
    margin-left: 5px;

    &:hover {
      text-decoration: underline;
    }
  }
`;
