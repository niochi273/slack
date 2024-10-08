import { Bell, Home, MessageSquare, MoreHorizontal } from "lucide-react"
import UserButton from "@/components/shared/user-button"
import WorkspaceSwitcher from "./workspace-switcher"
import { usePathname } from "next/navigation"
import SidebarButton from "./sidebar-button"

const Sidebar = () => {
	const pathname = usePathname()

	return (
		<aside className="w-[70px] h-full bg-[#420D43] flex flex-col gap-y-5 items-center pt-[9px] px-2 pb-4">
			<WorkspaceSwitcher />
			<SidebarButton icon={Home} label="Home" isActive={pathname.includes("/workspace")} />
			<SidebarButton icon={MessageSquare} label="DMs" />
			<SidebarButton icon={Bell} label="Activity" />
			<SidebarButton icon={MoreHorizontal} label="More" />
			<div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
				<UserButton />
			</div>
		</aside>
	)
}

export default Sidebar