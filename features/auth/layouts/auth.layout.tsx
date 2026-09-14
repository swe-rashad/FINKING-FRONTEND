import type { ReactNode } from "react";
import Image from 'next/image';
import Link from 'next/link';
import LogoSvg from '@/assets/icons/logo.svg';
import AuthDecor from '@/assets/images/auth-decor.svg';
import DashboardImage from '@/features/auth/assets/images/dashboard.png';

export function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <section className="w-full flex max-sm:p-0 p-4 sm:p-5 lg:p-6 h-screen overflow-hidden bg-slate-50/50">
            <div className="w-full sm:max-w-md lg:max-w-lg flex flex-col justify-between rounded-2xl p-6 sm:p-8 lg:p-10 h-full bg-white shadow-xs z-10 shrink-0">
                <div>
                    <Link href="/" className="inline-block">
                        <Image
                            width={160}
                            height={34}
                            src={LogoSvg}
                            alt="FINKING"
                            priority
                            className="h-8 w-auto object-contain block"
                        />
                    </Link>
                </div>
                <div className="w-full max-w-sm mx-auto my-auto py-6">
                    {children}
                </div>
                <div className="text-xs text-gray-400 text-center sm:text-left">
                    © {new Date().getFullYear()} FINKING Inc. All rights reserved.
                </div>
            </div>

            <div className="max-sm:hidden flex-1 h-full overflow-hidden relative rounded-2xl ml-4 lg:ml-6 bg-gradient-to-br from-[#F0F7FF] via-[#E8F2FE] to-[#DFEDFD] border border-blue-100/60 p-8 lg:p-12 flex flex-col justify-center shadow-inner">
                <Image
                    src={AuthDecor}
                    className="absolute -bottom-10 -right-10 pointer-events-none opacity-20 w-[110%] max-w-[50rem] h-auto object-contain"
                    alt="Network decoration"
                    priority
                />

                <div className="absolute top-0 right-0 w-80 h-80 bg-white/70 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-lg mb-2">
                    <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                        Manage global treasury with complete clarity
                    </h2>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        Track real-time liquidity, monitor high-volume transactions, and gain actionable financial insights in one unified workspace.
                    </p>
                </div>

                <div className="relative z-10 mt-6 pt-2">
                    <div className="w-full rounded-xl lg:rounded-2xl bg-white shadow-2xl shadow-blue-950/15 border border-gray-200/80 ring-1 ring-black/5 overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
                        <div className="px-4 py-3 rounded-xl bg-gray-50/90 border-b border-gray-200/70 flex items-center backdrop-blur-sm">
                            <div className="flex items-center gap-1.5 shrink-0">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                            </div>
                        </div>

                        <div className="relative w-full bg-white overflow-hidden">
                            <Image
                                src={DashboardImage}
                                alt="FINKING Statistics Dashboard"
                                priority
                                className="w-full h-auto object-cover object-top block select-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}