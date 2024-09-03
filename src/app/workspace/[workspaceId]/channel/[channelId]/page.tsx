"use client"

import { useGetChannel } from "@/lib/hooks/channels/get"
import { useChannelId } from "@/lib/hooks/channels/get-id"
import { Loader, TriangleAlert } from "lucide-react"
import Header from "./header"
import ChatInput from "./chat-input"
import { useGetMessages } from "@/lib/hooks/messages/get"
import MessageList from "@/components/shared/message-list"

export default function ChannelIdPage() {
	const channelId = useChannelId()

	const { results, status, loadMore } = useGetMessages({ channelId })
	const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId })
	console.log(results)

	if (channelLoading || status === 'LoadingFirstPage') {
		return (
			<div className="flex items-center justify-center h-full flex-1">
				<Loader size={20} className="animate-spin text-muted-foreground" />
			</div>
		)
	}

	if (!channel) {
		return (
			<div className="flex flex-col gap-y-2 items-center justify-center h-full flex-1">
				<TriangleAlert size={20} className="text-muted-foreground" />
				<span className="text-sm text-muted-foreground">Not found</span>
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full">
			<Header title={channel.name} />
			<MessageList
				channelName={channel.name}
				channelCreationTime={channel._creationTime}
				data={results}
				loadMore={loadMore}
				isLoadingMore={status === 'LoadingMore'}
				canLoadMore={status === 'CanLoadMore'}
			/>
			<ChatInput placeholder={`Message # ${channel.name}`} />
		</div>
	)
}
