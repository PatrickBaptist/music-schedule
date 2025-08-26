import React, { ReactNode } from 'react';
import { ContainerButton } from './ButtonsStyle';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, disabled, className, style }) => {

  return (
    <ContainerButton onClick={onClick} disabled={disabled} className={className} style={style} >
        {children}
    </ContainerButton>
  );
};

export default Button;