import "quill/dist/quill.snow.css"
import Quill, { QuillOptions } from 'quill'
import { useRef, useEffect, FC, MutableRefObject, useLayoutEffect, useState } from 'react'
import { Button } from '../ui/button'
import { PiTextAa } from 'react-icons/pi'
import { MdSend } from 'react-icons/md'
import { ImageIcon, Smile, XIcon } from 'lucide-react'
import { Hint } from '../ui/hint'
import { Delta, Op } from 'quill/core'
import clsx from "clsx"
import { cn } from "@/lib/utils"
import EmojiPopover from "@/app/workspace/[workspaceId]/channel/[channelId]/emoji-popover"
import Image from "next/image"

type EditorValue = {
	image: File | null
	body: string
}

interface EditorProps {
	variant?: "create" | "update"
	onSubmit: ({ image, body }: EditorValue) => void
	onCancel?: () => void
	placeholder?: string
	defaultValue?: Delta | Op[]
	disabled?: boolean
	innerRef?: MutableRefObject<Quill | null>
}

const Editor: FC<EditorProps> = ({
	onSubmit,
	onCancel,
	variant = "create",
	placeholder = "Type something...",
	defaultValue = [],
	disabled = false,
	innerRef
}) => {
	const [text, setText] = useState<string>("")
	const [image, setImage] = useState<File | null>(null)
	const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true)

	const containterRef = useRef<HTMLDivElement | null>(null)
	const submitRef = useRef(onSubmit)
	const placeholderRef = useRef(placeholder)
	const quillRef = useRef<Quill | null>(null)
	const defaultValueRef = useRef(defaultValue)
	const disabledRef = useRef(disabled)
	const imageRef = useRef<HTMLInputElement | null>(null)

	useLayoutEffect(() => {
		submitRef.current = onSubmit;
		placeholderRef.current = placeholder;
		defaultValueRef.current = defaultValue;
		disabledRef.current = disabled;
	})

	useEffect(() => {
		if (!containterRef || !containterRef.current) return

		const containter = containterRef.current
		const editorContainter = containter.appendChild(
			containter.ownerDocument.createElement("div")
		)

		const options: QuillOptions = {
			theme: 'snow',
			placeholder: placeholderRef.current,
			modules: {
				toolbar: [
					['bold', 'italic', 'strike'],
					['link'],
					[{ list: "ordered" }, { list: "bullet" }]
				],
				keyboard: {
					bindings: {
						enter: {
							key: "Enter",
							handler: () => {
								const text = quill.getText()
								const addedImage = imageRef.current?.files![0] || null

								const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, "").trim().length === 0

								if (isEmpty) return

								const body = JSON.stringify(quill.getContents())
								submitRef.current?.({ body, image: addedImage })
							}
						}
					}
				}
			}
		}

		const quill = new Quill(editorContainter, options)
		quillRef.current = quill
		quillRef.current.focus()

		if (innerRef) {
			innerRef.current = quill
		}

		quill.setContents(defaultValueRef.current)
		setText(quill.getText())

		quill.on(Quill.events.TEXT_CHANGE, () => {
			setText(quill.getText())
		})

		return () => {
			quill.off(Quill.events.TEXT_CHANGE)
			if (containter) {
				containter.innerHTML = ""
			}
			if (quillRef) {
				quillRef.current = null
			}
			if (innerRef) {
				innerRef.current = null
			}
		}
	}, [innerRef])

	const toggleToolbar = () => {
		setIsToolbarVisible(!isToolbarVisible)
		const toolbarElement = containterRef.current?.querySelector(".ql-toolbar")

		if (toolbarElement) {
			toolbarElement.classList.toggle("hidden")
		}
	}

	const onEmojiSelect = (emoji: any) => {
		const quill = quillRef.current
		quill?.insertText(quill.getSelection()?.index || 0, emoji.native)
	}

	const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0


	return (
		<div className="flex flex-col">
			<input
				type="file"
				accept="image/*"
				ref={imageRef}
				onChange={event => {
					setImage(event.target.files![0])
					quillRef.current?.focus()
				}}
				className="hidden"
			/>
			<div className={cn(
				"flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
				disabled && 'opacity-50'
			)}>
				<div spellCheck="false" ref={containterRef} className='h-full ql-custom' />
				{!!image && (
					<div className="p-2">
						<div className="relative size-[62px] flex items-center justify-center group/image">
							<Hint label="Remove image">
								<button
									onClick={() => {
										setImage(null)
										imageRef.current!.value = ""
									}}
									className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
								>
									<XIcon size={14} />
								</button>
							</Hint>
							<Image
								src={URL.createObjectURL(image)}
								alt="Uploaded"
								fill
								className="rounded-xl overflow-hidden border object-cover"
							/>
						</div>
					</div>
				)}
				<div className='flex px-2 pb-2 z-[5]'>
					<Hint label={isToolbarVisible ? "Hide formatting" : "Show formatting"}>
						<Button
							disabled={disabled}
							size="iconSm"
							variant="ghost"
							onClick={toggleToolbar}
						>
							<PiTextAa size={16} />
						</Button>
					</Hint>
					<EmojiPopover onEmojiSelect={onEmojiSelect}>
						<Button
							disabled={disabled}
							size="iconSm"
							variant="ghost"
						>
							<Smile size={16} />
						</Button>
					</EmojiPopover>
					{variant === 'create' && (
						<Hint label='Image'>
							<Button
								disabled={disabled}
								size="iconSm"
								variant="ghost"
								onClick={() => imageRef.current?.click()}
							>
								<ImageIcon size={16} />
							</Button>
						</Hint>
					)}
					{variant === "update" && (
						<div className='ml-auto flex items-center gap-x-2'>
							<Button
								variant="outline"
								size="sm"
								onClick={onCancel}
								disabled={disabled}
							>
								Cancel
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									onSubmit({
										body: JSON.stringify(quillRef.current?.getContents()),
										image
									})
								}}
								disabled={disabled || isEmpty}
								className='bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
							>
								Save
							</Button>
						</div>
					)}
					{variant === "create" && (
						<Button
							disabled={isEmpty || disabled}
							onClick={() => {
								onSubmit({
									body: JSON.stringify(quillRef.current?.getContents()),
									image
								})
							}}
							className={clsx('ml-auto', {
								"bg-white hover:bg-white text-muted-foreground cursor-default": isEmpty,
								"bg-[#007a5a] hover:bg-[#007a5a]/80 text-white": !isEmpty
							})}
							size="iconSm"
						>
							<MdSend size={16} />
						</Button>
					)}
				</div>
			</div>
			{variant === "create" && (
				<div className={cn('p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition-opacity',
					!isEmpty && 'opacity-100'
				)}>
					<p>
						<strong>Shift + Return</strong> to add a new line
					</p>
				</div>
			)}
		</div>
	)
}

export default Editor