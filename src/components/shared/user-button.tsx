import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "@/lib/hooks/get-user"
import { Loader, LogOut } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react"

const UserButton = () => {
	const { signOut } = useAuthActions()
	const { data, isLoading } = useCurrentUser()

	if (isLoading) {
		return <Loader size={30} className="animate-spin text-muted-foreground" />
	}

	if (!data) {
		return null
	}

	const { name, image, email } = data
	const avatarFallback = name?.charAt(0).toUpperCase()

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className="outline-none relative">
				<Avatar className="size-10 hover:opacity-75 transition-opacity">
					<AvatarImage alt={name} src={image} />
					<AvatarFallback>
						{avatarFallback}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" side="right" className="w-60">
				<DropdownMenuItem onClick={() => signOut()} className="h-10">
					<LogOut size={16} className="mr-2" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserButton

