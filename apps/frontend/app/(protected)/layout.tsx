"use client"
import Sidebar from "@/components/Sidebar/Sidebar"
import { usePathname, useRouter } from "next/navigation";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    const isWorkspaceRoute = pathname.startsWith("/codeRooms/workspace");

    return (
        <div className="flex h-screen overflow-hidden">
            {!isWorkspaceRoute && <Sidebar />}
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    )
}