'use client'

import { Button } from "@/components/ui/button"
import { useAuthActions } from "@convex-dev/auth/react"
import { useRouter } from "next/navigation"

export default function Page() {
	const router = useRouter()
	const { signOut } = useAuthActions()

	const handleSignOut = async () => {
		await signOut()
		router.replace('/')
	}

	return (
		<div>
			<div>Dashboard</div>
			<Button variant='destructive' onClick={handleSignOut}>Sign Out</Button>
		</div>
	)
}