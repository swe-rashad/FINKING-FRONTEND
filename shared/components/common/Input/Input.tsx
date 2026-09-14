import { useState, useId } from 'react';
import type { InputPropsType } from './input.type';
import { inputTypesEnum } from './input.type';
import OpenEyeIcon from '@/assets/icons/openEye.svg';
import ClosedEyeIcon from '@/assets/icons/closedEye.svg';
import Image from 'next/image';

export function Input({
    id,
    type = inputTypesEnum.Text,
    label,
    placeholder,
    className,
    value,
    onChange,
    ...rest
}: InputPropsType) {
    const generatedId = useId();
    const inputId = id || generatedId;
    const isPassword = type === inputTypesEnum.Password;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const resolvedType = isPassword
        ? isPasswordVisible
            ? 'text'
            : 'password'
        : type;

    return (
        <div className={`w-full ${className ?? ''}`}>
            {label && (
                <label htmlFor={inputId} className="block text-sm mb-1 font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="h-12 relative box-border rounded-xl bg-form-element-bg border border-transparent focus-within:border-primary-500 focus-within:bg-white transition-all">
                <input
                    id={inputId}
                    className="w-full h-full box-border px-4 rounded-xl text-sm text-gray-900 bg-transparent outline-none"
                    type={resolvedType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    {...rest}
                />
                {isPassword ? (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                        className="absolute h-12 pr-4 flex items-center right-0 -translate-y-1/2 top-1/2 cursor-pointer select-none bg-transparent border-none"
                    >
                        {isPasswordVisible ? (
                            <Image alt="open eye icon" src={OpenEyeIcon} />
                        ) : (
                            <Image alt="closed eye icon" src={ClosedEyeIcon} />
                        )}
                    </button>
                ) : null}
            </div>
        </div>
    );
}

export default Input;