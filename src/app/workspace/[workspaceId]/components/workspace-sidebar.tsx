import { useCurrentMember } from "@/lib/hooks/get-current-member"
import { useGetWorkspace } from "@/lib/hooks/get-workspace"
import { useWorkspaceId } from "@/lib/hooks/get-workspace-id"
import { AlertTriangle, Loader, Loader2 } from "lucide-react"
import WorkspaceHeader from "./header"

const WorkspaceSidebar = () => {
	const workspaceId = useWorkspaceId()

	const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
	const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })

	if (workspaceLoading || memberLoading) {
		return (
			<div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
				<Loader2 size={20} className="animate-spin text-white" />
			</div>
		)
	}

	if (!workspace || !member) {
		return (
			<div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
				<AlertTriangle size={20} className="text-white" />
				<p className="text-white text-sm">
					Workspace not found
				</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col bg-[#5E2C5F] h-full">
			<WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
		</div>
	)
}

export default WorkspaceSidebar