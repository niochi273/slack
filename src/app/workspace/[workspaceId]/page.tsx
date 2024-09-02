"use client"

import { useCreateChannelModal } from "@/lib/store/use-create-channel-modal"
import { useWorkspaceId } from "@/lib/hooks/workspaces/get-id"
import { useRouter } from "next/navigation"
import { useGetWorkspace } from "@/lib/hooks/workspaces/get"
import { useGetChannels } from "@/lib/hooks/channels/get-all"
import { useMemo, useEffect } from "react"
import { Loader, TriangleAlert } from "lucide-react"
import { useCurrentMember } from "@/lib/hooks/members/get-current"

export default function WorkspaceIdPage() {
	const [open, setOpen] = useCreateChannelModal()
	const workspaceId = useWorkspaceId()
	const router = useRouter()

	const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
	const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })
	const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId })

	const channelId = useMemo(() => channels?.[0]?._id, [channels])
	const isAdmin = useMemo(() => member?.role === 'admin', [member?.role])

	useEffect(() => {
		if (workspaceLoading || channelsLoading || !workspace || memberLoading || !member) return

		if (channelId) {
			router.replace(`/workspace/${workspaceId}/channel/${channelId}`)
		} else if (!open && isAdmin) {
			setOpen(true)
		}
	}, [
		channelId,
		member,
		isAdmin,
		memberLoading,
		open,
		router,
		setOpen,
		workspaceId,
		workspaceLoading,
		channelsLoading,
		workspace
	])

	if (workspaceLoading || channelsLoading || memberLoading) {
		return (
			<div className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
				<Loader size={24} className="text-muted-foreground animate-spin" />
			</div>
		)
	}

	if (!workspace || !member) {
		return (
			<div className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
				<TriangleAlert size={24} className="text-muted-foreground" />
				<span className="text-sm text-muted-foreground">
					Workspace not found
				</span>
			</div>
		)
	}

	return (
		<div className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
			<TriangleAlert size={24} className="text-muted-foreground" />
			<span className="text-sm text-muted-foreground">
				No channel found
			</span>
		</div>
	)
}