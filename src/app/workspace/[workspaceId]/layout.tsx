'use client'

import Toolbar from "@/components/shared/toolbar";

export default function WorkspaceIdLayout({ children }:
	{ children: React.ReactNode }
) {
	return (
		<div className="h-full">
			<Toolbar />
			{children}
		</div>
	)
}