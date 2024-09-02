import { useChannelId } from '@/lib/hooks/channels/get-id';
import { useCreateMessage } from '@/lib/hooks/messages/create';
import { useGenerateUploadUrl } from '@/lib/hooks/upload/generate-upload-url';
import { useWorkspaceId } from '@/lib/hooks/workspaces/get-id';
import dynamic from 'next/dynamic'
import Quill from 'quill';
import { FC, useRef, useState } from 'react'
import { toast } from 'sonner';
import { Id } from '../../../../../../convex/_generated/dataModel';

const Editor = dynamic(() => import("@/components/shared/editor"), { ssr: false })

interface ChatInputProps {
	placeholder: string;
}

type CreateMessageValues = {
	channelId: Id<"channels">
	workspaceId: Id<"workspaces">
	body: string
	image: Id<"_storage"> | undefined
}

const ChatInput: FC<ChatInputProps> = ({ placeholder }) => {
	const [editorKey, setEditorKey] = useState<number>(0)
	const [pending, setPending] = useState<boolean>(false)
	const editorRef = useRef<Quill | null>(null)

	const workspaceId = useWorkspaceId()
	const channelId = useChannelId()

	const { mutate: createMessage } = useCreateMessage()
	const { mutate: generateUploadUrl } = useGenerateUploadUrl()

	const handleSubmit = async ({ body, image }: {
		body: string,
		image: File | null
	}) => {
		try {
			setPending(true)
			editorRef.current?.enable(false)

			const values: CreateMessageValues = {
				workspaceId,
				channelId,
				body,
				image: undefined
			}

			if (image) {
				const url = await generateUploadUrl({ throwError: true })

				if (!url) {
					throw new Error("Url not found")
				}

				const result = await fetch(url, {
					method: "POST",
					headers: { "Content-Type": image.type },
					body: image
				})

				if (!result.ok) {
					throw new Error("Failed to upload image")
				}

				const { storageId } = await result.json();

				values.image = storageId
			}

			await createMessage(values, { throwError: true })

			setEditorKey(prevKey => prevKey + 1)
		} catch (error) {
			toast.error("Failed to send message")
		} finally {
			setPending(false)
			editorRef.current?.enable(false)
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