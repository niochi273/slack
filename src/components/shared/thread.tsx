import { FC, useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useGetMessage } from "@/lib/hooks/messages/get-by-id";
import Message from "./message";
import { useCurrentMember } from "@/lib/hooks/members/get-current";
import { useWorkspaceId } from "@/lib/hooks/workspaces/get-id";

interface ThreadProps {
	messageId: Id<"messages">
	onClose: () => void
}

const Thread: FC<ThreadProps> = ({ messageId, onClose }) => {
	const workspaceId = useWorkspaceId()
	const [editingId, setEditingId] = useState<Id<"messages"> | null>(null)

	const { data: currentMember } = useCurrentMember({ workspaceId })
	const { data: message, isLoading: loadingMessage } = useGetMessage({ id: messageId })

	if (loadingMessage) {
		return (
			<div className="h-fulll flex flex-col">
				<div className="flex h-[49px] justify-between items-center px-4 border-b">
					<p className="text-lg font-bold">Thread</p>
					<Button onClick={onClose} variant="ghost" size="iconSm">
						<XIcon size={20} />
					</Button>
				</div>
				<div className="flex flex-col gap-y-2 h-full items-center justify-center">
					<Loader size={20} className="text-muted-foreground animate-spin" />
					<p className="text-sm text-muted-foreground">Message not found</p>
				</div>
			</div>
		)
	}

	if (!message) {
		return (
			<div className="h-fulll flex flex-col">
				<div className="flex h-[49px] justify-between items-center px-4 border-b">
					<p className="text-lg font-bold">Thread</p>
					<Button onClick={onClose} variant="ghost" size="iconSm">
						<XIcon size={20} />
					</Button>
				</div>
				<div className="flex flex-col gap-y-2 h-full items-center justify-center">
					<AlertTriangle size={20} className="text-muted-foreground" />
					<p className="text-sm text-muted-foreground">Message not found</p>
				</div>
			</div>
		)
	}

	return (
		<div className="h-fulll flex flex-col">
			<div className="flex h-[49px] justify-between items-center px-4 border-b">
				<p className="text-lg font-bold">Thread</p>
				<Button onClick={onClose} variant="ghost" size="iconSm">
					<XIcon size={20} />
				</Button>
			</div>
			<Message
				hideThreadButton
				memberId={message.memberId}
				authorImage={message.user.image}
				authorName={message.user.name}
				isAuthor={message.memberId === currentMember?._id}
				body={message.body}
				image={message.image}
				createdAt={message._creationTime}
				updatedAt={message.updatedAt}
				id={message._id}
				reactions={message.reactions}
				isEditing={editingId === message._id}
				setEditingId={setEditingId}
			/>
		</div>
	)
}

export default Thread