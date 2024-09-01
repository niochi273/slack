
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"

import React, { useState } from "react"
import { useCreateChannelModal } from "@/lib/store/use-create-channel-modal"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useCreateChannel } from "@/lib/hooks/channels/create"
import { useWorkspaceId } from "@/lib/hooks/workspaces/get-id"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const CreateChannelModal = () => {
	const router = useRouter()
	const workspaceId = useWorkspaceId()
	const [open, setOpen] = useCreateChannelModal()
	const [name, setName] = useState<string>("")
	const { mutate, isPending } = useCreateChannel()

	const handleClose = () => {
		setName("")
		setOpen(false)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\s+/g, '-').toLowerCase()
		setName(value)
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		mutate(
			{ name, workspaceId },
			{
				onSuccess: (id) => {
					toast.success("Channel created")
					router.push(`/workspace/${workspaceId}/channel/${id}`)
					handleClose()
				},
				onError: () => {
					toast.error("Error to create channel")
				}
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a channel</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<Input
						value={name}
						disabled={isPending}
						onChange={handleChange}
						required
						autoFocus
						minLength={3}
						maxLength={80}
						placeholder="e.g. plan-budget"
					/>
					<div className="flex justify-end">
						<Button disabled={isPending}>
							Create
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}