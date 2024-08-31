import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useWorkspaceId } from "@/lib/hooks/workspaces/get-id"
import { useGetWorkspaces } from "@/lib/hooks/workspaces/get-all"
import { useGetWorkspace } from "@/lib/hooks/workspaces/get"
import { useCreateWorkspaceModal } from "@/lib/store/use-create-workspace-modal"
import { Loader, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

const WorkspaceSwitcher = () => {
	const router = useRouter()
	const workspaceId = useWorkspaceId()
	const [_, setOpen] = useCreateWorkspaceModal()

	const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })
	const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces()

	const filteredWorkspaces = workspaces?.filter(workspace => {
		return workspace?._id !== workspaceId
	})

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="size-9 relative focus-visible:ring-0 shrink-0 focus-visible:ring-offset-0 overflow-hidden bg-[#ABABAB] hover:bg-[#ABABAB]/80 text-slate-800 font-semibold text-xl">
					{workspaceLoading ? (
						<Loader size={20} className="animate-spin shrink-0" />
					) : workspace?.name.charAt(0).toUpperCase()}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="bottom" align="start" className="w-64">
				<DropdownMenuItem
					onClick={() => router.push(`/workspace/${workspaceId}`)}
					className="cursor-pointer flex-col justify-start items-start capitalize"
				>
					{workspace?.name}
					<span className="text-xs text-muted-foreground">
						Active workspace
					</span>
				</DropdownMenuItem>

				{filteredWorkspaces?.map(workspace => (
					<DropdownMenuItem
						key={workspace._id}
						className="cursor-pointer capitalize"
						onClick={() => router.push(`/workspace/${workspace._id}`)}
					>
						<div className="shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
							{workspace.name.charAt(0).toUpperCase()}
						</div>
						<p className="truncate">
							{workspace.name}
						</p>
					</DropdownMenuItem>
				))}

				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => setOpen(true)}
				>
					<div className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
						<Plus />
					</div>
					Create a new workspace
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default WorkspaceSwitcher