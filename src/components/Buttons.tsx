import React, { ReactNode } from 'react';
import { ContainerButton } from './styles/Buttons';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {

  return (
    <ContainerButton onClick={onClick}>
        {children}
    </ContainerButton>
  );
};

export default Button;