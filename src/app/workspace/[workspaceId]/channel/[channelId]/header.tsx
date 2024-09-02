import { Button } from "@/components/ui/button"
import { FaChevronDown } from "react-icons/fa"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose
} from "@/components/ui/dialog"
import { Trash } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useUpdateChannel } from "@/lib/hooks/channels/update"
import { useChannelId } from "@/lib/hooks/channels/get-id"
import { toast } from "sonner"
import { useRemoveChannel } from "@/lib/hooks/channels/remove"
import { useConfirm } from "@/components/shared/confirm"
import { useRouter } from "next/navigation"
import { useWorkspaceId } from "@/lib/hooks/workspaces/get-id"
import { useCurrentMember } from "@/lib/hooks/members/get-current"

const Header = ({ title }: { title: string }) => {
	const router = useRouter()
	const channelId = useChannelId()
	const workspaceId = useWorkspaceId()


	const [ConfirmDialog, confirm] = useConfirm(
		"Delete this channel?",
		"This action is irreversible"
	)

	const [value, setValue] = useState<string>(title)
	const [editOpen, setEditOpen] = useState<boolean>(false)

	const { data: member } = useCurrentMember({ workspaceId })
	const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel()
	const { mutate: removeChannel, isPending: isRemovingChannel } = useRemoveChannel()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\s+/g, '-').toLowerCase()
		setValue(value)
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		updateChannel({ id: channelId, name: value }, {
			onSuccess: () => {
				setEditOpen(false)
				toast.success("Channel updated")
			}, onError: () => {
				toast.error("Failed to update channel")
			}
		})
	}

	const handleDelete = async () => {
		const ok = await confirm()

		if (!ok) return

		removeChannel({
			id: channelId
		}, {
			onSuccess: () => {
				toast.success("Channel deleted")
				router.replace(`/workspace/${workspaceId}`)
			}, onError: () => {
				toast.error("Failed to delete channel")
			}
		})
	}

	if (member?.role !== 'admin') {
		return (
			<div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
				<Button
					variant="ghost"
					className="text-lg font-semibold px-2 overflow-hidden w-auto cursor-default"
				>
					<span className="truncate"># {title}</span>
				</Button>
			</div>
		)
	}

	return (
		<div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
			<ConfirmDialog />
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant="ghost"
						className="text-lg font-semibold px-2 overflow-hidden w-auto"
						size="sm"
					>
						<span className="truncate"># {title}</span>
						<FaChevronDown size={10} className="ml-2" />
					</Button>
				</DialogTrigger>
				<DialogContent className="p-0 bg-gray-50 overflow-hidden" aria-describedby={undefined}>
					<DialogHeader className="p-4 border-b bg-white">
						<DialogTitle># {title}</DialogTitle>
					</DialogHeader>
					<div className="px-4 pb-4 flex flex-col gap-y-2">
						<Dialog open={editOpen} onOpenChange={setEditOpen}>
							<DialogTrigger asChild>
								<div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
									<div className="flex items-center justify-between">
										<p className="text-sm font-semibold">Channel name</p>
										<p className="text-sm text-[#1c81cd] hover:underline font-semibold">Edit</p>
									</div>
									<p className="text-sm"># {title}</p>
								</div>
							</DialogTrigger>
							<DialogContent aria-describedby={undefined}>
								<DialogHeader>
									<DialogTitle>
										Rename this channel
									</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleSubmit} className="space-y-4">
									<Input
										value={value}
										disabled={isUpdatingChannel}
										onChange={handleChange}
										required
										autoFocus
										minLength={3}
										maxLength={80}
										placeholder="e.g. plan-budget"
									/>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="outline" disabled={isUpdatingChannel} >
												Cancel
											</Button>
										</DialogClose>
										<Button disabled={isUpdatingChannel}>
											Save
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
						<button
							disabled={isRemovingChannel}
							onClick={handleDelete}
							className="flex items-center ring-0 outline-none ring-offset-0 gap-x-2 px-5 bg-white py-4 rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
						>
							<Trash size={16} />
							<p className="text-sm font-semibold">Delete workspace</p>
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default Header
