'use client'

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup
} from "@/components/ui/resizable"
import Toolbar from "./components/toolbar";
import Sidebar from "./components/sidebar";
import WorkspaceSidebar from "./components/workspace-sidebar";
import { usePanel } from "@/lib/hooks/use-panel";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import Thread from "@/components/shared/thread";

export default function WorkspaceIdLayout({ children }:
	{ children: React.ReactNode }
) {
	const { parentMessageId, onClose } = usePanel()

	const showPanel = !!parentMessageId

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
						minSize={15}
						className="bg-[#5E2C5F]"
					>
						<WorkspaceSidebar />
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel minSize={20} >
						{children}
					</ResizablePanel>
					{showPanel && (
						<>
							<ResizableHandle withHandle />
							<ResizablePanel minSize={20} defaultSize={29}>
								{parentMessageId ? (
									<Thread
										messageId={parentMessageId as Id<"messages">}
										onClose={onClose}
									/>
								) : (
									<div className="flex h-full items-center justify-center">
										<Loader size={20} className="text-muted-foreground animate-spin" />
									</div>
								)}
							</ResizablePanel>
						</>
					)}
				</ResizablePanelGroup>
			</div>
		</div >
	)
}