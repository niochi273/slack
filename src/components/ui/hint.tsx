'use client'

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { FC } from "react";


interface HintProps {
	label: string;
	children: React.ReactNode
	side?: "top" | "right" | "bottom" | "left",
	align?: "start" | "center" | "end"
}

export const Hint: FC<HintProps> = ({ label, children, align, side }) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger>
					{children}
				</TooltipTrigger>
				<TooltipContent side={side} align={align} className="bg-black text-white border border-white/5">
					<p className="font-medium text-xs">
						{label}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}