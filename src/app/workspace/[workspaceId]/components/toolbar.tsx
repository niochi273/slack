import { Info, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWorkspaceId } from "@/lib/hooks/workspaces/get-id"
import { useGetWorkspace } from "@/lib/hooks/workspaces/get";

const Toolbar = () => {
	const workspaceId = useWorkspaceId();
	const { data } = useGetWorkspace({ id: workspaceId })

	return (
		<nav className='bg-[#420D43] flex items-center justify-between h-10 px-1.5 py-1.5'>
			<div className="flex-1">

			</div>
			<div className="min-w-[280px] max-w-[642px] grow-[2] shrink h-full">
				<Button
					size="sm"
					className="bg-accent/25 hover:bg-accent-25 w-full justify-start px-2 h-full"
				>
					<span className="text-white text-xs font-normal">
						Search {data?.name}
					</span>
					<Search size={16} className="text-white ml-auto" />
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
