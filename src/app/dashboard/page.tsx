'use client'

import { Button } from "@/components/ui/button"
import { useAuthActions } from "@convex-dev/auth/react"

export default function Page() {
	const { signOut } = useAuthActions()

	return (
		<div>
			<div>Dashboard</div>
			<Button variant='destructive' onClick={() => signOut()}>Sign Out</Button>
		</div>
	)
}