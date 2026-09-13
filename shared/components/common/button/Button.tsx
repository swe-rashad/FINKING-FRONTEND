import type { ButtonPropsType } from "./button.type";

export function Button({
    children,
    icon,
    iconPosition = 'left',
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    type = 'button',
    disabled,
    ...props
}: ButtonPropsType) {
    const sizeClasses = size === 'sm'
        ? 'h-8 px-3 text-xs rounded-lg gap-1.5'
        : 'h-11 px-5 text-sm rounded-xl gap-2';

    const baseClasses =
        `flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${sizeClasses}`;

    let variantClasses = "";
    switch (variant) {
        case 'secondary':
            variantClasses = "bg-gray-100 hover:bg-gray-200 text-gray-700";
            break;
        case 'outline':
            variantClasses = "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700";
            break;
        case 'danger':
            variantClasses = "bg-red-500 hover:bg-red-600 text-white shadow-xs";
            break;
        case 'primary':
        default:
            variantClasses = "bg-primary-500 hover:bg-primary-900 text-white shadow-xs";
            break;
    }

    const spinner = (
        <span
            aria-hidden="true"
            className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0"
        />
    );

    return (
        <button
            type={type}
            disabled={disabled || loading}
            aria-busy={loading}
            className={`${baseClasses} ${variantClasses} ${className}`}
            {...props}
        >
            {loading && iconPosition === 'left' && spinner}
            {!loading && icon && iconPosition === 'left' && (
                <span className="shrink-0 flex items-center">{icon}</span>
            )}
            {children && <span>{children}</span>}
            {loading && iconPosition === 'right' && spinner}
            {!loading && icon && iconPosition === 'right' && (
                <span className="shrink-0 flex items-center">{icon}</span>
            )}
        </button>
    );
}

export default Button;