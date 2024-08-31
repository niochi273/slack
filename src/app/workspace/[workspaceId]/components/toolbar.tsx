import { Info, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWorkspaceId } from "@/lib/hooks/workspaces/get-id"
import { useGetWorkspace } from "@/lib/hooks/workspaces/get";
import { useAuthActions } from "@convex-dev/auth/react";

const Toolbar = () => {
	const workspaceId = useWorkspaceId();
	const { data } = useGetWorkspace({ id: workspaceId })

	return (
		<nav className='bg-[#481349] flex items-center justify-between h-10 p-1.5'>
			<div className="flex-1">

			</div>
			<div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
				<Button
					size="sm"
					className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
				>
					<Search size={16} className="text-white mr-2" />
					<span className="text-white text-xs">
						Search {data?.name}
					</span>
				</Button>
			</div>
			<div className="ml-auto flex flex-1 items-center justify-end">
				<Button variant="transparent" size="iconSm">
					<Info size={20} className="text-white" />
				</Button>
			</div>
		</nav>
	)
}

export default Toolbar
