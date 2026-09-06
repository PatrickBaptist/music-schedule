import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion } from "motion/react";
import { ContainerButton } from "./ButtonsStyle";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "icon"
  | "tab"
  | "unstyled";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      type = "button",
      variant = "primary",
      size = "md",
      fullWidth = false,
      ...props
    },
    ref,
  ) => (
    <ContainerButton
      ref={ref}
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      {...props}
    >
      {children}
    </ContainerButton>
  ),
);

Button.displayName = "Button";

export const MotionButton = motion.create(Button);
export default Button;
