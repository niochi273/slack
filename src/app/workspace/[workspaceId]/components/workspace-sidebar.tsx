import { AlertTriangle, HashIcon, Loader, Loader2, MessageSquareText, SendHorizonal } from "lucide-react"
import { useCurrentMember } from "@/lib/hooks/members/get-current"
import { useGetWorkspace } from "@/lib/hooks/workspaces/get"
import { useWorkspaceId } from "@/lib/hooks/workspaces/get-id"
import { useGetChannels } from "@/lib/hooks/channels/get-all"
import WorkspaceSection from "./workspace-section"
import WorkspaceHeader from "./header"
import SidebarItem from "./sidebar-item"
import { useGetMembers } from "@/lib/hooks/members/get-all"
import UserItem from "./user-item"
import { useCreateChannelModal } from "@/lib/store/use-create-channel-modal"
import { useChannelId } from "@/lib/hooks/channels/get-id"
import { useMemberId } from "@/lib/hooks/members/get-id"

const WorkspaceSidebar = () => {
	const memberId = useMemberId()
	const channelId = useChannelId()
	const workspaceId = useWorkspaceId()

	const [_, setOpen] = useCreateChannelModal()

	const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
	const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })
	const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId })
	const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId })

	if (workspaceLoading || memberLoading || membersLoading || channelsLoading) {
		return (
			<div className="flex flex-col bg-[#562458] h-full items-center justify-center">
				<Loader size={20} className="animate-spin text-white" />
			</div>
		)
	}

	if (!workspace || !member) {
		return (
			<div className="flex flex-col bg-[#562458] h-full items-center justify-center">
				<AlertTriangle size={20} color="white" />
				<p className="text-white text-sm">Workspace not found</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col bg-[#562458] h-full gap-y-2.5">
			<WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
			<div className="flex flex-col px-2 gap-y-1">
				<SidebarItem
					id="threads"
					variant="default"
					label="Threads"
					icon={MessageSquareText}
				/>
				<SidebarItem
					id="drafts"
					variant="default"
					label="Drafts & Sent"
					icon={SendHorizonal}
				/>
			</div>
			<WorkspaceSection
				label="Channels"
				hint="New channel"
				onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
			>
				{channels?.map(item => (
					<SidebarItem
						key={item._id}
						id={item._id}
						label={item.name}
						icon={HashIcon}
						variant={channelId === item._id ? "active" : "default"}
					/>
				))}
			</WorkspaceSection>
			<WorkspaceSection
				label="Direct Messages"
				hint="New direct message"
				onNew={() => { }}
			>
				{members?.map(item => (
					<UserItem
						key={item._id}
						id={item._id}
						label={item.user.name}
						image={item.user.image}
						variant={item._id === memberId ? "active" : "default"}
					/>
				))}
			</WorkspaceSection>
		</div>
	)
}

export default WorkspaceSidebar