import Appbar from "@/components/CodeRooms/WorkSpace/Appbar"


export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col justify-start items-center h-screen w-full overflow-hidden">
            <Appbar />
            <div className="flex-1 w-full">
                {children}
            </div>

        </div>
    )
}