import { FC } from "react"
import { Button } from "../ui/button";
import { MessageSquareText, Pencil, Smile, Trash } from "lucide-react";
import { Hint } from "../ui/hint";
import EmojiPopover from "@/app/workspace/[workspaceId]/channel/[channelId]/emoji-popover";

interface ToolbarProps {
	isAuthor: boolean;
	isPending: boolean;
	handleEdit: () => void;
	handleThread: () => void;
	handleDelete: () => void;
	handleReaction: (value: string) => void;
	hideThreadButton?: boolean;
}

const Toolbar: FC<ToolbarProps> = ({
	isAuthor,
	isPending,
	handleEdit,
	handleThread,
	handleDelete,
	handleReaction,
	hideThreadButton
}) => {
	return (
		<div className="absolute top-0 right-5">
			<div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
				<EmojiPopover
					hint="Add reaction"
					onEmojiSelect={(emoji) => handleReaction(emoji.native)}
				>
					<Button
						variant="ghost"
						size="iconSm"
						disabled={isPending}
					>
						<Smile size={16} />
					</Button>
				</EmojiPopover>
				{!hideThreadButton && (
					<Hint label="Reply in thread">
						<Button
							variant="ghost"
							size="iconSm"
							disabled={isPending}
						>
							<MessageSquareText size={16} />
						</Button>
					</Hint>
				)}
				{isAuthor && (
					<>
						<Hint label="Edit message">
							<Button
								variant="ghost"
								size="iconSm"
								disabled={isPending}
							>
								<Pencil size={16} />
							</Button>
						</Hint>
						<Hint label="Delete message">
							<Button
								variant="ghost"
								size="iconSm"
								disabled={isPending}
							>
								<Trash size={16} />
							</Button>
						</Hint>
					</>
				)}
			</div>
		</div>
	)
}

export default Toolbar