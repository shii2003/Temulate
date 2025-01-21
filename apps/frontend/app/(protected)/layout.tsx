"use client"
import Sidebar from "@/components/Sidebar/Sidebar"
import { usePathname } from "next/navigation";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();


    const isWorkspaceRoute = pathname.startsWith("/codeRooms/workspace");

    return (
        <div className="flex ">
            {!isWorkspaceRoute && <Sidebar />}
            {children}
        </div>
    )
}