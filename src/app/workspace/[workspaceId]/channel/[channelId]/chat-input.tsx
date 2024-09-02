import dynamic from 'next/dynamic'
import Quill from 'quill';
import { FC, useRef } from 'react'

const Editor = dynamic(() => import("@/components/shared/editor"), { ssr: false })

interface ChatInputProps {
	placeholder: string;
}

const ChatInput: FC<ChatInputProps> = ({ placeholder }) => {
	const editorRef = useRef<Quill | null>(null)

	return (
		<div className="px-5 w-full">
			<Editor
				placeholder={placeholder}
				onSubmit={() => { }}
				disabled={false}
				innerRef={editorRef}
			/>
		</div>
	)
}

export default ChatInput