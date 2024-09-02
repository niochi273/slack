import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Hint } from "@/components/ui/hint"
import { Button } from "@/components/ui/button"
import { Doc } from "../../../../../convex/_generated/dataModel"
import { ChevronDown, ListFilter, SquarePen } from "lucide-react"
import { FC, useState } from 'react'
import PreferencesModal from "./preferences"
import InviteModal from "./invite-modal"

interface WorkspaceHeaderProps {
	workspace: Doc<"workspaces">
	isAdmin: boolean
}

const WorkspaceHeader: FC<WorkspaceHeaderProps> = ({ workspace, isAdmin }) => {
	const [preferencesOpen, setPreferencesOpen] = useState<boolean>(false)
	const [inviteOpen, setInviteOpen] = useState<boolean>(false)

	if (!isAdmin) {
		return (
			<div className="flex items-center justify-between px-4 pt-5 gap-x-1">
				<Button
					variant="transparent"
					className="font-semibold hover:bg-transparent text-lg w-auto p-2 overflow-hidden focus-visible:ring-0 focus-visible:ring-offset-0 tracking-wide cursor-default"
					size="sm"
				>
					<span className="truncate">{workspace.name}</span>
				</Button>
				<div className="flex items-center gap-x-1">
					<Hint label="Filter conversations" side="bottom" >
						<Button variant="transparent" size="iconSm">
							<ListFilter size={16} />
						</Button>
					</Hint>
					<Hint label="New message" side="bottom" >
						<Button variant="transparent" size="iconSm">
							<SquarePen size={16} />
						</Button>
					</Hint>
				</div>
			</div>
		)
	}

	return (
		<>
			<InviteModal
				open={inviteOpen}
				setOpen={setInviteOpen}
				name={workspace.name}
				joinCode={workspace.joinCode}
			/>
			<PreferencesModal
				open={preferencesOpen}
				setOpen={setPreferencesOpen}
				initialValue={workspace.name}
			/>
			<div className="flex items-center justify-between px-4 pt-5 gap-x-1">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="transparent"
							className="font-semibold text-lg w-auto p-2 overflow-hidden focus-visible:ring-0 focus-visible:ring-offset-0 tracking-wide"
							size="sm"
						>
							<span className="truncate">{workspace.name}</span>
							<ChevronDown size={16} className="ml-1 shrink-0" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="bottom" align="start" className="w-64">
						<DropdownMenuItem className="cursor-pointert capitalize">
							<div className="size-9 relative overeflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
								{workspace.name.charAt(0).toUpperCase()}
							</div>
							<div className="flex flex-col items-start">
								<p className="font-bold">{workspace.name}</p>
								<p className="text-xs text-muted-foreground">Active workspace</p>
							</div>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="cursor-pointer py-2"
							onClick={() => setInviteOpen(true)}
						>
							Invite people to {workspace.name}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="cursor-pointer py-2"
							onClick={() => setPreferencesOpen(true)}
						>
							Preferences
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<div className="flex items-center gap-x-1">
					<Hint label="Filter conversations" side="bottom" >
						<Button variant="transparent" size="iconSm">
							<ListFilter size={16} />
						</Button>
					</Hint>
					<Hint label="New message" side="bottom" >
						<Button variant="transparent" size="iconSm">
							<SquarePen size={16} />
						</Button>
					</Hint>
				</div>
			</div>
		</>
	)
}

export default WorkspaceHeader