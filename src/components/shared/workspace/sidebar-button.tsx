import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { LucideIcon } from "lucide-react"
import { FC } from "react"
import { IconType } from "react-icons/lib"

interface SidebarButtnoProps {
	icon: LucideIcon | IconType
	label: string
	isActive?: boolean
}


const SidebarButton: FC<SidebarButtnoProps> = ({
	icon: Icon,
	label,
	isActive
}) => {
	return (
		<div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
			<Button variant="transparent" className={clsx("size-9 p-2 group-hover:bg-accent/20",
				{
					"bg-accent/20": isActive
				}
			)}
			>
				<Icon size={20} className="text-white group-hover:scale-110 transition-all" />
			</Button>
			<span className="text-[11px] text-white group-hover:text-accent">
				{label}
			</span>
		</div >
	)
}

export default SidebarButton