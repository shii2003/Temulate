import Appbar from "@/components/CodeRooms/WorkSpace/Appbar"


export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className=" flex flex-col  justify-start items-center h-screen w-full bg-neutral-800">
            <div className=" flex-grow w-full  h-[calc(100vh-4rem)] border-t border-neutral-700">
                {children}
            </div>
        </div>
    )
}