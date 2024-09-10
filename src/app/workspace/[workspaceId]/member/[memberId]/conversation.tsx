import { FC } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useMemberId } from "@/lib/hooks/members/get-id";
import { useGetMember } from "@/lib/hooks/members/get";
import { useGetMessages } from "@/lib/hooks/messages/get";
import { Loader } from "lucide-react";
import Header from "./header";
import ChatInput from "./chat-input";
import MessageList from "@/components/shared/message-list";

interface ConversationProps {
	id: Id<"conversations">
}

const Conversation: FC<ConversationProps> = ({ id }) => {
	const memberId = useMemberId()

	const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId })
	const { results, status, loadMore } = useGetMessages({
		conversationId: id
	})

	if (memberLoading || status === 'LoadingFirstPage') {
		return (
			<div className="h-full flex items-center justify-center">
				<Loader size={24} className="animate-spin text-muted-foreground" />
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full">
			<Header
				memberName={member?.user.name}
				memberImage={member?.user.image}
				onClick={() => { }}
			/>
			<MessageList
				data={results}
				variant="conversation"
				memberImage={member?.user.image}
				memberName={member?.user.name}
				loadMore={loadMore}
				isLoadingMore={status === "LoadingMore"}
				canLoadMore={status === "CanLoadMore"}
			/>
			<ChatInput
				placeholder={`Message ${member?.user.name}`}
				conversationId={id}
			/>
		</div>
	)
}

export default Conversation
