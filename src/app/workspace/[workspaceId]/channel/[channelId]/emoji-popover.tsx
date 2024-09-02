import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { FC, useState } from "react";
import Picker from '@emoji-mart/react'
import data from "@emoji-mart/data"

interface EmojiPopoverProps {
	children: React.ReactNode;
	hint?: string;
	onEmojiSelect: (emoji: any) => void
}

const EmojiPopover: FC<EmojiPopoverProps> = ({
	children,
	hint = "Emoji",
	onEmojiSelect
}) => {
	const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
	const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)

	const onSelect = (emoji: any) => {
		onEmojiSelect(emoji)
		setPopoverOpen(false)

		setTimeout(() => {
			setTooltipOpen(false)
		}, 500)
	}

	return (
		<TooltipProvider>
			<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
				<Tooltip
					open={tooltipOpen}
					onOpenChange={setTooltipOpen}
					delayDuration={50}
				>
					<PopoverTrigger asChild>
						<TooltipTrigger asChild>
							{children}
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className="bg-black text-white border border-white/5">
						<p className="font-medium text-xs">{hint}</p>
					</TooltipContent>
				</Tooltip>
				<PopoverContent className="p-0 w-full border-none shadow-none">
					<Picker data={data} onEmojiSelect={onSelect} />
				</PopoverContent>
			</Popover>
		</TooltipProvider>
	)
}

export default EmojiPopover


