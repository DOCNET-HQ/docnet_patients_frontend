import { ChatSidebar } from "@/components/chat/chat-sidebar";

export default function MessageLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-[calc(100vh-50px)] lg:px-4 -mt-3 justify-center overflow-hidden">
            <ChatSidebar />
            { children }
        </div>
    )
}
