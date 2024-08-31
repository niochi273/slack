import { Button } from "@/components/ui/button"
import { FaCaretDown } from "react-icons/fa"
import { Hint } from "@/components/ui/hint"
import { useToggle } from "react-use"
import { Plus } from "lucide-react"
import { FC } from "react"
import clsx from "clsx"

interface WorkspaceSectionProps {
	children: React.ReactNode,
	label: string,
	hint: string,
	onNew?: () => void
}

const WorkspaceSection: FC<WorkspaceSectionProps> = ({ children, label, hint, onNew }) => {
	const [on, toggle] = useToggle(true)

	return (
		<div className="flex flex-col mt-3 px-2">
			<div className="flex item-center px-3.5 group">
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
				<Button
					variant="transparent"
					size="sm"
					className="group px-1.5 text-sm text-[#f9edffcc] h-[28px] justify-start overflow-hidden items-center"
				>
					<span className="truncate">{label}</span>
				</Button>
				{onNew && (
					<Hint label={hint} side="top" align="center">
						<Button
							onClick={onNew}
							variant="transparent"
							size="iconSm"
							className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0"
						>
							<Plus size={20} />
						</Button>
					</Hint>
				)}
			</div>
			{on && children}
		</div>
	)
}

export default WorkspaceSection