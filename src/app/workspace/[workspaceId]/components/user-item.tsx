import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Id } from "../../../../../convex/_generated/dataModel"
import { cva, VariantProps } from "class-variance-authority"
import { useWorkspaceId } from "@/lib/hooks/workspaces/get-id"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FC } from "react"
import Link from "next/link"

interface UserItemProps {
	id: Id<"members">
	label?: string
	image?: string
	variant?: VariantProps<typeof userItemVariants>['variant']
}

const userItemVariants = cva(
	'flex items-center gap-x-1.5 font-normal justify-start h-9 text-sm px-4 overflow-hidden',
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

const UserItem: FC<UserItemProps> = ({
	id,
	label = "Member",
	image,
	variant
}) => {
	const workspaceId = useWorkspaceId()
	const avatrFallback = label.charAt(0).toUpperCase()

	return (
		<Button
			variant="transparent"
			className={cn(userItemVariants({ variant }))}
			size="sm"
			asChild
		>
			<Link href={`/workspace/${workspaceId}/member/${id}`}>
				<Avatar className="size-5 rounded-md mr-1">
					<AvatarImage className="rounded-md" src={image} />
					<AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">{avatrFallback}</AvatarFallback>
				</Avatar>
				<span className="text-sm truncate">{label}</span>
			</Link>
		</Button>
	)
}

export default UserItem