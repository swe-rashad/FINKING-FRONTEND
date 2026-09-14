import { ReactNode, useState, useEffect } from 'react';
import { loadMessages } from '@/core/i18n/loader';
import { defaultLocale } from '@/core/i18n/config';
import Sidebar from '@/features/dashboard/components/Sidebar/Sidebar';
import UserProfileDropdown from '@/features/dashboard/components/UserProfileDropdown/UserProfileDropdown';
import MenuToggleIcon from '@/features/dashboard/components/icons/MenuToggleIcon';

import Image from 'next/image';
import LogoSvg from '@/assets/icons/logo.svg';
import { AuthGuard } from '@/shared/components/guards';

export async function getStaticProps() {
    const messages = await loadMessages(defaultLocale, ['dashboard']);
    return { props: { messages } };
}

const STORAGE_KEY = 'finking_sidebar_collapsed';

let globalCollapsed = false;

if (typeof window !== 'undefined') {
    try {
        globalCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
    } catch { }
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(globalCollapsed);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored !== null) {
                const isCollapsed = stored === 'true';
                globalCollapsed = isCollapsed;
                queueMicrotask(() => {
                    setCollapsed(isCollapsed);
                });
            }
        } catch { }
    }, []);

    const handleToggle = () => {
        setCollapsed((prev) => {
            const next = !prev;
            globalCollapsed = next;
            try {
                localStorage.setItem(STORAGE_KEY, String(next));
            } catch { }
            return next;
        });
    };

    return (
        <AuthGuard>
            <section className="w-full flex h-screen bg-[#F9F9F9] overflow-hidden relative">
                <Sidebar
                    collapsed={collapsed}
                    onToggle={handleToggle}
                    mobileOpen={mobileSidebarOpen}
                    onMobileClose={() => setMobileSidebarOpen(false)}
                />
                <main className="w-full h-full flex flex-col gap-0 md:gap-6 overflow-hidden">
                    <header className="w-full h-20 min-h-20 bg-white md:bg-transparent border-b border-gray-100 md:border-b-0 flex items-center justify-between md:justify-end px-4 sm:px-6 shrink-0 z-30 shadow-xs md:shadow-none">
                        <div className="flex items-center gap-2 md:hidden">
                            <button
                                type="button"
                                onClick={() => setMobileSidebarOpen(true)}
                                className="w-10 h-10 flex items-center justify-center -ml-1.5 rounded-xl text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer shrink-0"
                                aria-label="Open sidebar menu"
                            >
                                <MenuToggleIcon size={24} />
                            </button>
                            <div className="flex items-center shrink-0">
                                <Image
                                    src={LogoSvg}
                                    width={155}
                                    height={40}
                                    alt="FINKING"
                                    className="h-10 w-auto object-contain block"
                                    priority
                                />
                            </div>
                        </div>
                        <UserProfileDropdown />
                    </header>
                    <div className="flex-1 w-full overflow-y-auto min-h-0 pt-3 md:pt-0">
                        {children}
                    </div>
                </main>
            </section>
        </AuthGuard>
    );
}