import { useConfirm } from "@/components/shared/confirm";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useWorkspaceId } from "@/lib/hooks/workspaces/get-id";
import { useNewJoinCode } from "@/lib/hooks/workspaces/new-join-code";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "sonner";

interface InviteModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	name: string;
	joinCode: string;
}

const InviteModal: FC<InviteModalProps> = ({
	open,
	setOpen,
	name,
	joinCode,
}) => {
	const workspaceId = useWorkspaceId();
	const [copied, setCopied] = useState<boolean>(false);
	const [ConfirmDialog, confirm] = useConfirm(
		"Are you sure?",
		"This will deactivate the current code and generate a new one"
	)

	const { mutate, isPending } = useNewJoinCode()

	const handleNewCode = async () => {
		const ok = await confirm();

		if (!ok) return;

		mutate({ workspaceId }, {
			onSuccess: () => {
				toast.success("Invite code regenerated")
			},
			onError: () => {
				toast.error("Failed to regenrate invite code")
			}
		})
	}

	const handleCopy = () => {
		const inviteLink = `${window.location.origin}/join/${workspaceId}`;
		navigator.clipboard
			.writeText(inviteLink)
			.then(() => {
				setCopied(true);
				toast.success("Invite link copied to clipboard");
				setTimeout(() => setCopied(false), 3000); // Reset copied state after 3 seconds
			})
			.catch(() => {
				toast.error("Failed to copy link to clipboard");
			});
	};

	return (
		<>
			<ConfirmDialog />
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Invite people to {name}</DialogTitle>
						<DialogDescription>
							Use a code below to invite people to your workspace
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-y-4 items-center justify-center py-4">
						<p className="text-4xl font-bold tracking-widest bg-muted/80 px-8 py-5 rounded-md">
							{joinCode}
						</p>
						<Button
							onClick={handleCopy}
							disabled={copied}
							variant="ghost"
							size="sm"
						>
							{copied ? (
								<>
									<Check size={16} className="mr-2" />
									Copied
								</>
							) : (
								<>
									<Copy size={16} className="mr-2" />
									Copy link
								</>
							)}
						</Button>
					</div>
					<div className="flex items-center justify-between w-full">
						<Button
							onClick={handleNewCode}
							variant="outline"
							disabled={isPending}
						>
							<RefreshCcw size={16} className="mr-2" />
							New code
						</Button>
						<DialogClose asChild>
							<Button>Close</Button>
						</DialogClose>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default InviteModal;
