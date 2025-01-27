"use client"
import Sidebar from "@/components/Sidebar/Sidebar"
import { useAppSelector } from "@/hooks/redux";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    const isWorkspaceRoute = pathname.startsWith("/codeRooms/workspace");

    if (!user) {
        return null;
    }

    return (
        <div className="flex ">
            {!isWorkspaceRoute && <Sidebar />}
            {children}
        </div>
    )
}