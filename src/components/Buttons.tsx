import React, { ReactNode } from 'react';
import { ContainerButton } from './styles/Buttons';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {

  return (
    <ContainerButton onClick={onClick} className={className}>
        {children}
    </ContainerButton>
  );
};

export default Button;