"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Template({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Don't show Navbar/Footer on admin, portal, and login routes
    const hideLayout = pathname?.startsWith('/admin') ||
        pathname?.startsWith('/portal') ||
        pathname?.startsWith('/login');

    return (
        <>
            {!hideLayout && <Navbar />}
            <main style={{ minHeight: hideLayout ? '100vh' : '80vh' }}>
                {children}
            </main>
            {!hideLayout && <Footer />}
        </>
    );
}
