'use client'

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup
} from "@/components/ui/resizable"
import Toolbar from "./components/toolbar";
import Sidebar from "./components/sidebar";
import WorkspaceSidebar from "./components/workspace-sidebar";

export default function WorkspaceIdLayout({ children }:
	{ children: React.ReactNode }
) {
	return (
		<div className="h-full">
			<Toolbar />
			<div className="flex h-[calc(100vh-40px)]">
				<Sidebar />
				<ResizablePanelGroup
					direction="horizontal"
					autoSaveId="workspace-layout"
				>
					<ResizablePanel
						defaultSize={20}
						minSize={11}
						className="bg-[#5E2C5F]"
					>

						<WorkspaceSidebar />
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel minSize={20}>
						{children}
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div >
	)
}