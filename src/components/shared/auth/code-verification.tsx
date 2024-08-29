import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent
} from "@/components/ui/card"
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
	DialogDescription
} from "@/components/ui/dialog"
import { Dispatch, FC, SetStateAction, useRef, useState } from "react"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { useAuthActions } from "@convex-dev/auth/react"
import { Button } from "@/components/ui/button"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useForm } from "@tanstack/react-form"
import { Input } from "@/components/ui/input"
import { PulseLoader } from "react-spinners"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Step } from "./reset-password"
import { toast } from "sonner"
import { z } from "zod"
import clsx from "clsx"

interface CodeVerificationFormProps {
	email: string
	setStep: Dispatch<SetStateAction<Step>>
}

export const CodeVerificationForm: FC<CodeVerificationFormProps> = ({ email, setStep }) => {
	const { signIn } = useAuthActions()
	const router = useRouter()
	const passwordRef = useRef<HTMLInputElement | null>(null)
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

	const { handleSubmit, Subscribe, Field } = useForm({
		validatorAdapter: zodValidator(),
		defaultValues: {
			code: "",
			newPassword: ""
		},
		onSubmit: async ({ value }) => {
			signIn("password", { ...value, email, flow: "reset-verification", redirectTo: "/" })
				.then(() => toast.success("Password was successfully changed!"))
				.catch(() => toast.error("Password was not changed!"))
		}
	})

	return (
		<Card className="w-full h-full p-8">
			<CardHeader className="px-0 pt-0">
				<CardTitle>Create new password</CardTitle >
				<CardDescription>
					Provide the code &#40;7 digits&#41;
				</CardDescription>
			</CardHeader >
			<CardContent className="px-0 pb-0 flex flex-col items-center">
				<form
					noValidate
					className="space-y-3 max-w-[280px]"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handleSubmit();
					}}
				>
					<Field
						name="code"
						validators={{
							[isSubmitted ? "onChange" : "onSubmit"]: z.string().min(7, "Code is required"),
						}}
					>
						{field => (
							<div className="flex flex-col w-full">
								<InputOTP
									required
									maxLength={7}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(value) => field.handleChange(value)}
									pattern={REGEXP_ONLY_DIGITS}
								>
									<InputOTPGroup>
										<InputOTPSlot index={0} />
										<InputOTPSlot index={1} />
										<InputOTPSlot index={2} />
										<InputOTPSlot index={3} />
										<InputOTPSlot index={4} />
										<InputOTPSlot index={5} />
										<InputOTPSlot index={6} />
									</InputOTPGroup>
								</InputOTP>
								{field.state.meta.errors.length > 0 &&
									typeof field.state.meta.errors[0] ===
									"string" ? (
									<em className="text-red-500 text-sm">
										{field.state.meta.errors[0].split(", ")[0]}
									</em>
								) : null}
							</div>
						)}
					</Field>
					<Field
						name="newPassword"
						validators={{
							[isSubmitted ? 'onChange' : 'onSubmit']: z
								.string()
								.min(1, "Password is required")
								.min(5, "Password must contain at least 5 characters")
								.max(50, "Password must contain at most 50 characters")
								.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
								.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
								.regex(/[0-9]/, { message: "Password must contain at least one number" })
								.regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character" })
						}}
					>
						{(field) => (
							<div className="w-full flex flex-col relative">
								<Input
									ref={passwordRef}
									type={isPasswordVisible ? "text" : "password"}
									placeholder="New password"
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									required
									className={clsx(
										"focus-visible:ring-0 focus-visible:ring-offset-0 pr-10",
										{
											"border-red-500": field.state.meta.errors.length,
										}
									)}
								/>
								{passwordRef.current && passwordRef.current.value ? (
									<>
										{isPasswordVisible ?
											<Eye
												size={20}
												className="absolute right-[10px] top-[11px] cursor-pointer text-gray-400 hover:text-gray-500 transition-colors"
												onClick={(e) => {
													e.preventDefault();
													setIsPasswordVisible(false)
												}}
											/> :
											<EyeOff
												size={20}
												className="absolute right-[10px] top-[11px] cursor-pointer text-gray-400 hover:text-gray-500 transition-colors"
												onClick={(e) => {
													e.preventDefault();
													setIsPasswordVisible(true)
												}}
											/>
										}
									</>
								) : null}
								{field.state.meta.errors.length > 0 &&
									typeof field.state.meta.errors[0] ===
									"string" ? (
									<em className="text-red-500 text-sm self-start">
										{field.state.meta.errors[0].split(", ")[0]}
									</em>
								) : null}
							</div>
						)}
					</Field>
					<div className="flex justify-between w-full">
						<Subscribe
							selector={(state) => [
								state.canSubmit,
								state.isSubmitting,
							]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button
									type="submit"
									className="w-24"
									size="lg"
									disabled={!canSubmit}
									onClick={() => setIsSubmitted(true)}
								>
									{isSubmitting ?
										<PulseLoader
											color="white"
											loading={true}
											size={8}
											aria-label="Loading Spinner"
											data-testid="loader"
										/> : "Continue"}
								</Button>
							)}
						</Subscribe>
						<Dialog>
							<DialogTrigger asChild>
								<Button
									type="button"
									className="w-24"
									size="lg"
									variant="destructive"
								>
									Cancel
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>
										Cancel password reset
									</DialogTitle>
									<DialogDescription>
										Are you sure you want to cancel your password reset?
									</DialogDescription>
								</DialogHeader>
								<DialogFooter className="flex justify-around">
									<Button
										variant="destructive"
										className="w-[60px]"
										onClick={() => router.replace('/auth/signin')}
									>
										Yes
									</Button>
									<DialogClose asChild>
										<Button
											variant="outline"
											className="w-[60px]"
										>
											No
										</Button>
									</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</form>
			</CardContent>
		</Card >
	)
}