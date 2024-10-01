import React, { ReactNode } from 'react';
import { ContainerButton } from './styles/Buttons';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className, style }) => {

  return (
    <ContainerButton onClick={onClick} className={className} style={style} >
        {children}
    </ContainerButton>
  );
};

export default Button;