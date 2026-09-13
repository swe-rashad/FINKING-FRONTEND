import { InputHTMLAttributes } from 'react';

export const inputTypesEnum = {
    Text: "text",
    Password: "password",
    Email: "email"
} as const;

export type InputTypesEnumType = (typeof inputTypesEnum)[keyof typeof inputTypesEnum] | string;

export type InputPropsType = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    type?: InputTypesEnumType;
    label?: string;
    placeholder?: string;
    className?: string;
};