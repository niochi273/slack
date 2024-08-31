'use client'

import { useEffect, useState } from "react"

import { CreateChannelModal } from "./create-channel-modal"
import { CreateWorkspaceModal } from "./create-workspace-modal"


const Modals = () => {
	const [mounted, setMounted] = useState<boolean>(false)

	useEffect(() => setMounted(true), [])

	if (!mounted) return null

	return (
		<>
			<CreateChannelModal />
			<CreateWorkspaceModal />
		</>
	)

}

export default Modals