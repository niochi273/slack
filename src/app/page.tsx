'use client'

import UserButton from "@/components/shared/user-button"
import { useCreateWorkspaceModal } from "@/lib/store/use-create-workspace-modal"

import { useGetWorkspaces } from "@/lib/hooks/workspaces/get-all"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"

export default function Home() {
  const router = useRouter()
  const [open, setOpen] = useCreateWorkspaceModal();
  const { data, isLoading } = useGetWorkspaces()

  const workspaceId = useMemo(() => data?.[0]?._id, [data])

  useEffect(() => {
    if (isLoading) return

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`)
    } else if (!open) {
      setOpen(true)
    }
  }, [workspaceId, isLoading, open, setOpen, router])

  return (
    <div>
      <UserButton />
    </div>
  )
}
