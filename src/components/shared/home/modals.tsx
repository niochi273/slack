"use client"

import { useEffect, useState } from "react"
import { CreateWorkspaceModal } from "@/components/shared/store/create-workspace-modal"

export const Modals = () => {
	const [mounted, setMounted] = useState<boolean>(false);

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) null

	return <CreateWorkspaceModal />
}