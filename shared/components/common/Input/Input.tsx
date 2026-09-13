import { useState } from 'react';
import type { InputPropsType } from './input.type';
import { inputTypesEnum } from './input.type';
import OpenEyeIcon from '@/assets/icons/openEye.svg';
import ClosedEyeIcon from '@/assets/icons/closedEye.svg';
import Image from 'next/image';

export function Input({
    type = inputTypesEnum.Text,
    label,
    placeholder,
    className,
    value,
    onChange,
    ...rest
}: InputPropsType) {
    const [inputType, setInputType] = useState(type);

    const setPasswordType = () => {
        if (inputType === inputTypesEnum.Password) {
            setInputType(inputTypesEnum.Text);
        } else {
            setInputType(inputTypesEnum.Password);
        }
    };

    const PasswordInputEye = () => {
        return (
            <div
                onClick={setPasswordType}
                className="absolute h-12 pr-4 flex items-center right-0 -translate-y-1/2 top-1/2 cursor-pointer select-none"
            >
                {inputType === inputTypesEnum.Password ? (
                    <Image alt="closed eye icon" src={ClosedEyeIcon} />
                ) : (
                    <Image alt="open eye icon" src={OpenEyeIcon} />
                )}
            </div>
        );
    };

    const displayLabel = label ?? placeholder;

    return (
        <div className={`w-full ${className ?? ''}`}>
            {displayLabel && (
                <p className="text-sm mb-1 font-medium text-gray-700">
                    {displayLabel}
                </p>
            )}
            <div className="h-12 relative box-border rounded-xl bg-form-element-bg border border-transparent focus-within:border-primary-500 focus-within:bg-white transition-all">
                <input
                    className="w-full h-full box-border px-4 rounded-xl text-sm text-gray-900 bg-transparent outline-none"
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    {...rest}
                />
                {type === inputTypesEnum.Password ? <PasswordInputEye /> : null}
            </div>
        </div>
    );
}

export default Input;