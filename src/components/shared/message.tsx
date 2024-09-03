import { FC } from "react"
import { Doc, Id } from "../../../convex/_generated/dataModel"
import dynamic from "next/dynamic"
import { format, formatDate, isToday, isYesterday } from "date-fns"
import { Hint } from "../ui/hint"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Thumbnail from "./thubmnail"
import Toolbar from "./toolbar"
const Renderer = dynamic(() => import("@/components/shared/renderer"), { ssr: false })


interface MessageProps {
	id: Id<"messages">
	memberId: Id<"members">
	authorImage?: string
	authorName?: string
	isAuthor: boolean
	reactions: Array<Omit<Doc<"reactions">, "memberId"> & {
		count: number
		memberIds: Id<"members">[]
	}>
	body: Doc<"messages">["body"]
	image: string | null | undefined
	createdAt: Doc<"messages">["_creationTime"]
	updatedAt: Doc<"messages">["updatedAt"]
	isEditing: boolean
	isCompact?: boolean
	setEditingId: (id: Id<"messages"> | null) => void
	hideThreadButton?: boolean
	threadCount?: number
	threadImage?: string
	threadTimestamp?: number
}

const formatFullTime = (date: Date) => {
	return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : formatDate(date, "MMM d, yyyy")} at ${formatDate(date, "h:mm:ss a")}`
}

const Message: FC<MessageProps> = ({
	id,
	isAuthor,
	memberId,
	authorImage,
	authorName = "Member",
	reactions,
	body,
	image,
	createdAt,
	updatedAt,
	isEditing,
	isCompact,
	setEditingId,
	hideThreadButton,
	threadCount,
	threadImage,
	threadTimestamp
}) => {
	const avatrFallback = authorName.charAt(0).toUpperCase()

	if (isCompact) {
		return (
			<div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
				<div className="flex items-start gap-2">
					<Hint label={formatFullTime(new Date(createdAt))}>
						<button className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
							{format(new Date(createdAt), "hh:mm")}
						</button>
					</Hint>
					<div className="flex flex-col w-full">
						<Renderer value={body} />
						<Thumbnail url={image} />
						{updatedAt ? (
							<span className="text-xs text-muted-foreground italic">
								(edited)
							</span>
						) : null}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
			<div className="flex items-start gap-2">
				<button>
					<Avatar className="rounded-md">
						<AvatarImage src={authorImage} />
						<AvatarFallback>{avatrFallback}</AvatarFallback>
					</Avatar>
				</button>
				<div className="flex flex-col w-full overflow-hidden">
					<div className="text-sm">
						<button
							className="font-bold text-primary hover:underline"
							onClick={() => { }}
						>
							{authorName}
						</button>
						<span>&nbsp;&nbsp;</span>
						<Hint label={formatFullTime(new Date(createdAt))}>
							<button className="text-xs text-muted-foreground hover:underline">
								{format(new Date(createdAt), "h:mm a")}
							</button>
						</Hint>
					</div>
					<Renderer value={body} />
					<Thumbnail url={image} />
					{updatedAt ? (
						<span className="text-xs text-muted-foreground italic">
							(edited)
						</span>
					) : null}
				</div>
			</div>
			{!isEditing && (
				<Toolbar
					isAuthor={isAuthor}
					isPending={false}
					handleEdit={() => setEditingId(id)}
					handleThread={() => { }}
					handleDelete={() => { }}
					handleReaction={() => { }}
					hideThreadButton={hideThreadButton}
				/>
			)}
		</div>
	)

}

export default Message
