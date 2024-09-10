'use client'

import { useCreateOrGetConversation } from "@/lib/hooks/conversations/create"
import { useMemberId } from "@/lib/hooks/members/get-id"
import { useWorkspaceId } from "@/lib/hooks/workspaces/get-id"
import { AlertTriangle, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { toast } from "sonner"
import Conversation from "./conversation"

export default function Page() {
	const workspaceId = useWorkspaceId()
	const memberId = useMemberId()

	const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null)

	const { mutate, isPending } = useCreateOrGetConversation()

	useEffect(() => {
		mutate({
			workspaceId,
			memberId
		}, {
			onSuccess(data) {
				setConversationId(data)
			}, onError() {
				toast.error("Failed to create or get conversation")
			}
		})
	}, [memberId, workspaceId, mutate])

	if (isPending) {
		return (
			<div className="h-full flex items-center justify-center">
				<Loader size={24} className="animate-spin text-muted-foreground" />
			</div>
		)
	}

	if (!conversationId) {
		return (
			<div className="h-full flex flex-col gap-y-2 items-center justify-center">
				<AlertTriangle size={24} className="text-muted-foreground" />
				<span className="text-sm text-muted-foreground">
					Conversation not found
				</span>
			</div>
		)
	}

	return <Conversation id={conversationId} />
}