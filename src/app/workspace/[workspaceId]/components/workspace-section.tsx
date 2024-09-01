import { Button } from "@/components/ui/button"
import { FaCaretDown } from "react-icons/fa"
import { useToggle } from "react-use"
import { Hint } from "@/components/ui/hint"
import { Plus } from "lucide-react"
import { FC } from "react"
import clsx from "clsx"
import { cn } from "@/lib/utils"

interface WorkspaceSectionProps {
	children: React.ReactNode,
	label: string,
	hint: string,
	onNew?: () => void
}

const WorkspaceSection: FC<WorkspaceSectionProps> = ({ children, label, hint, onNew }) => {
	const [on, toggle] = useToggle(true)

	return (
		<div className="flex flex-col px-2 py-1">
			<div className={cn("flex item-center px-3.5 group", on && "mb-2")}>
				<Button
					variant="transparent"
					className="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6"
					onClick={toggle}
				>
					<FaCaretDown size={16} className={clsx('transition-transform',
						{
							'rotate-0': on,
							'-rotate-90': !on
						}
					)} />
				</Button>
				<div className="truncate cursor-default px-1.5 text-sm text-[#f9edffcc] overflow-hidden flex items-center h-full">{label}</div>
				{onNew && <Hint label={hint} side="top" align="center">
					<Button
						onClick={onNew}
						variant="transparent"
						size="iconSm"
						className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0"
					>
						<Plus size={20} />
					</Button>
				</Hint>}
			</div>
			<div className="flex flex-col gap-y-1">
				{on && children}
			</div>
		</div>
	)
}

export default WorkspaceSection