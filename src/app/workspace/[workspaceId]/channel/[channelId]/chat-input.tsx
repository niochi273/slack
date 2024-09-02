import { useChannelId } from '@/lib/hooks/channels/get-id';
import { useCreateMessage } from '@/lib/hooks/messages/create';
import { useWorkspaceId } from '@/lib/hooks/workspaces/get-id';
import dynamic from 'next/dynamic'
import Quill from 'quill';
import { FC, useRef, useState } from 'react'
import { toast } from 'sonner';

const Editor = dynamic(() => import("@/components/shared/editor"), { ssr: false })

interface ChatInputProps {
	placeholder: string;
}

const ChatInput: FC<ChatInputProps> = ({ placeholder }) => {
	const [editorKey, setEditorKey] = useState<number>(0)
	const [pending, setPending] = useState<boolean>(false)

	const editorRef = useRef<Quill | null>(null)

	const { mutate: createMessage } = useCreateMessage()
	const workspaceId = useWorkspaceId()
	const channelId = useChannelId()

	const handleSubmit = async ({ body, image }: {
		body: string,
		image: File | null
	}) => {
		try {
			setPending(true)
			await createMessage({
				workspaceId,
				channelId,
				body
			}, { throwError: true })

			setEditorKey(prevKey => prevKey + 1)
		} catch (error) {
			toast.error("Failed to send message")
		} finally {
			setPending(false)
		}

	}

	return (
		<div className="px-5 w-full">
			<Editor
				key={editorKey}
				placeholder={placeholder}
				onSubmit={handleSubmit}
				disabled={pending}
				innerRef={editorRef}
			/>
		</div>
	)
}

export default ChatInput