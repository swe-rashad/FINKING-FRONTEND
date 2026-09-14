import { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md';

export type ButtonPropsType = ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    className?: string;
};