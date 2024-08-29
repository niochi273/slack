'use client'

import { useGetWorkspace } from "@/lib/hooks/get-workspace";
import { useWorkspaceId } from "@/lib/hooks/get-workspace-id";

export default function WorkspaceIdPage() {
	const workspaceId = useWorkspaceId()
	const { data, isPending } = useGetWorkspace({ id: workspaceId })

	if (isPending) return <div>Loading...</div>

	return (
		<div>
			Data: {JSON.stringify(data)}
		</div>
	)
}