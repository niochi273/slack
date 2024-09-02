import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
	DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRemoveWorkspace } from "@/lib/hooks/workspaces/remove"
import { useUpdateWorkspace } from "@/lib/hooks/workspaces/update"
import { useWorkspaceId } from "@/lib/hooks/workspaces/get-id"
import { useRouter } from "next/navigation"
import { Trash } from "lucide-react"
import { FC, useState } from "react"
import { toast } from "sonner"
import { useConfirm } from "@/components/shared/confirm"


interface PreferencesModalProps {
	open: boolean
	setOpen: (open: boolean) => void
	initialValue: string
}

const PreferencesModal: FC<PreferencesModalProps> = ({ open, setOpen, initialValue }) => {
	const router = useRouter()
	const workspaceId = useWorkspaceId()
	const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This action is irreversible")

	const [value, setValue] = useState<string>(initialValue)
	const [editOpen, setEditOpen] = useState<boolean>(false)

	const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace()
	const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace()

	const handleRemove = async () => {
		const ok = await confirm()

		if (!ok) return

		removeWorkspace({
			id: workspaceId
		}, {
			onSuccess: () => {
				toast.success("Workspace removed")
				router.replace("/")
			},
			onError: () => {
				toast.error("Failed to remove workspace")
			}
		})
	}

	const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		updateWorkspace({
			id: workspaceId,
			name: value
		}, {
			onSuccess: () => {
				toast.success("Workspace updated")
				setEditOpen(false)
			},
			onError: () => {
				toast.error("Failed to update workspace")
			}
		})
	}

	return (
		<>
			<ConfirmDialog />
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="p-0 bg-gray-50 overflow-hidden" aria-describedby={undefined}>
					<DialogHeader className="p-4 border-b bg-white">
						<DialogTitle>{initialValue}</DialogTitle>
					</DialogHeader>
					<div className="px-4 pb-4 flex flex-col gap-y-2">
						<Dialog open={editOpen} onOpenChange={setEditOpen}>
							<DialogTrigger asChild>
								<div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
									<div className="flex items-center justify-between">
										<p className="text-sm font-semibold">Workspace name</p>
										<p className="text-sm text-[#1c81cd] hover:underline font-semibold">Edit</p>
									</div>
									<p className="text-sm">{initialValue}</p>
								</div>
							</DialogTrigger>
							<DialogContent aria-describedby={undefined}>
								<DialogHeader>
									<DialogTitle>Rename a workspace</DialogTitle>
								</DialogHeader>
								<form className="space-y-4" onSubmit={handleEdit}>
									<Input
										value={value}
										disabled={isUpdatingWorkspace}
										onChange={e => setValue(e.target.value)}
										required
										autoFocus
										minLength={3}
										maxLength={80}
										className="focus-visible:ring-0 focus-visible:ring-offset-0"
										placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
									/>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="outline" disabled={isUpdatingWorkspace} >
												Cancel
											</Button>
										</DialogClose>
										<Button disabled={isUpdatingWorkspace} >
											Save
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
						<button
							disabled={isRemovingWorkspace}
							onClick={handleRemove}
							className="flex items-center ring-0 outline-none ring-offset-0 gap-x-2 px-5 bg-white py-4 rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
						>
							<Trash size={16} />
							<p className="text-sm font-semibold">Delete workspace</p>
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default PreferencesModal