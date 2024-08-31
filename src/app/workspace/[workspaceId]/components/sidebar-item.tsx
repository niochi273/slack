import { useWorkspaceId } from "@/lib/hooks/workspaces/get-id";
import { cva, type VariantProps } from "class-variance-authority"
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FC } from "react";
import Link from "next/link";

const sidebarItemVariants = cva(
	'flex items-center gap-x-1.5 font-normal justify-start h-9 text-sm px-[18px] overflow-hidden',
	{
		variants: {
			variant: {
				default: "text-[#f9edffcc]",
				active: "text-[#481349] bg-white/90 hover:bg-white/90"
			}
		},
		defaultVariants: {
			variant: "default"
		}
	}
)

interface SidebarItemProps {
	label: string
	id: string
	icon: LucideIcon
	variant?: VariantProps<typeof sidebarItemVariants>["variant"]
}

const SidebarItem: FC<SidebarItemProps> = ({ label, id, icon: Icon, variant }) => {
	const workspaceId = useWorkspaceId()

	return (
		<Button
			variant="transparent"
			size="sm"
			className={cn(sidebarItemVariants({ variant }))}
			asChild
		>
			<Link href={`/workspace/${workspaceId}/channel/${id}`} >
				<Icon size={14} className="mr-1 shrink-0" />
				<span className="text-sm truncate">{label}</span>
			</Link>
		</Button>
	)
}

export default SidebarItem


