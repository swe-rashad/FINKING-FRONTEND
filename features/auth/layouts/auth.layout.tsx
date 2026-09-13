import type { ReactNode } from "react";
import Image from 'next/image'
import LogoSvg from '@/assets/icons/logo.svg';
import AuthDecor from '@/assets/images/auth-decor.svg';

export function AuthLayout({ children }: { children: ReactNode }) {
    return <>
        <section className="w-full flex max-sm:p-0 p-6 h-screen overflow-hidden">
            <div className="w-full flex flex-col justify-between rounded-2xl box-border p-4 h-full">
                <Image
                    width={240}
                    height={130}
                    src={LogoSvg}
                    alt="Logo image"
                />
                <div className="w-full">
                    {children}
                </div>
                <div></div>
            </div>
            <div className="max-sm:hidden h-full overflow-hidden relative bg-primary-50 rounded-2xl box-border p-4 min-w-[42.563rem]">
                <Image
                    src={AuthDecor}
                    className="-bottom-5 pointer-events-none absolute -right-10"
                    alt="Logo image"
                />
            </div>
        </section>
    </>;
}