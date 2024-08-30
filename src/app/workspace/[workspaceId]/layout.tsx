'use client'

import Toolbar from "@/components/shared/workspace/toolbar";
import Sidebar from "@/components/shared/workspace/sidebar";

export default function WorkspaceIdLayout({ children }:
	{ children: React.ReactNode }
) {
	return (
		<div className="h-full">
			<Toolbar />
			<div className="flex h-[calc(100vh-40px)]">
				<Sidebar />
				{children}
			</div>
		</div>
	)
}