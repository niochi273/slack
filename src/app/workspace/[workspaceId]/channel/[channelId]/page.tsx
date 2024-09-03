"use client"

import { useGetChannel } from "@/lib/hooks/channels/get"
import { useChannelId } from "@/lib/hooks/channels/get-id"
import { Loader, TriangleAlert } from "lucide-react"
import Header from "./header"
import ChatInput from "./chat-input"
import { useGetMessages } from "@/lib/hooks/messages/get"

export default function ChannelIdPage() {
	const channelId = useChannelId()

	const { results } = useGetMessages({ channelId })
	const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId })
	console.log(results)

	if (channelLoading) {
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
			<div className="flex-1" >
				{JSON.stringify(results)}
			</div>
			<ChatInput placeholder={`Message # ${channel.name}`} />
		</div>
	)
}
