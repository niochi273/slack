"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { useGetWorkspaceInfo } from "@/lib/hooks/workspaces/get-workspace-info"
import { Loader } from "lucide-react"
import { Id } from "../../../../convex/_generated/dataModel"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export default function JoinPage({ params }: { params: { workspaceId: Id<"workspaces"> } }) {
	const router = useRouter()
	const { workspaceId } = params
	const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId })
	const isMember = useMemo(() => data?.isMember, [data?.isMember])
	const [isPending, setIsPending] = useState<boolean>(false)

	useEffect(() => {
		if (isMember) {
			router.replace(`/workspace/${workspaceId}`)
		}
	}, [isMember, router, workspaceId])

	const mutation = useMutation(api.workspaces.join);

	const handleComplete = async (value: string) => {
		try {
			setIsPending(true)
			const response = await mutation({ workspaceId, joinCode: value });

			if (response) {
				toast.success("Workspace joined")
				router.replace(`/workspace/${workspaceId}`)
			}
		} catch {
			toast.error("Failed to join workspace")
		} finally {
			setIsPending(false)
		}
	}

	if (isLoading) {
		return (
			<div className="h-full flex items-center justify-center">
				<Loader size={24} className="animate-spin text-muted-foreground" />
			</div>
		)
	}

	return (
		<div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
			<Image src="/logo.svg" width={60} height={60} alt="Logo" />
			<div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
				<div className=" flex flex-col gap-y-2 items-center justify-center">
					<h1 className="text-2xl font-bold">
						Join {data?.name}
					</h1>
					<p className="text-md text-muted-foreground">
						Enter the workspace code to join
					</p>
				</div>
				<InputOTP
					maxLength={6}
					pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
					onComplete={handleComplete}
					disabled={isPending}
					spellCheck="false"
					autoFocus
				>
					<InputOTPGroup>
						{
							Array.from({ length: 6 }, (_, index) => (
								<InputOTPSlot
									key={index}
									index={index}
								/>
							))
						}
					</InputOTPGroup>
				</InputOTP>
			</div>
			<div className="flex gap-x-4">
				<Button
					size="lg"
					variant="outline"
					asChild
				>
					<Link href="/">
						Back to home
					</Link>
				</Button>
			</div>
		</div>
	)
}