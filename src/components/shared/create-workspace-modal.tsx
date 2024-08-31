'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription
} from "@/components/ui/dialog"
import { useCreateWorkspaceModal } from "@/lib/hooks/workspaces/create-modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateWorkspace } from "@/lib/hooks/workspaces/create"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const CreateWorkspaceModal = () => {
	const router = useRouter()
	const [open, setOpen] = useCreateWorkspaceModal()
	const [name, setName] = useState<string>("")

	const { mutate, isPending } = useCreateWorkspace()

	const handleClose = () => {
		setOpen(false)
		setName("")
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		mutate({ name }, {
			onSuccess(workspaceId) {
				router.push(`/workspace/${workspaceId}`)
				handleClose()
				toast.success("Workspace created")
			}
		})
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a workspace</DialogTitle>
					<DialogDescription>Come up with a name for your workspace</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						value={name}
						onChange={e => setName(e.target.value)}
						disabled={isPending}
						required
						autoFocus
						minLength={3}
						className="focus-visible:ring-0 focus-visible:ring-offset-0"
						placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
					/>
					<div className="flex justify-end">
						<Button disabled={isPending} type="submit">
							Create
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
