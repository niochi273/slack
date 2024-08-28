'use client'

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card"
import { CodeVerificationForm } from "./code-verification";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { IoArrowBack } from "react-icons/io5";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PulseLoader } from 'react-spinners'
import { Step } from "@/lib/types";
import { useState } from "react";
import { z } from "zod";
import clsx from "clsx";

export const ResetPassword = () => {
	const [step, setStep] = useState<Step>("forgot");
	const [error, setError] = useState<string>("")
	const [pending, setPending] = useState<boolean>(false)
	const { signIn } = useAuthActions();
	const router = useRouter()

	const { handleSubmit, Subscribe, Field } = useForm({
		validatorAdapter: zodValidator(),
		defaultValues: {
			email: ""
		},
		onSubmit: ({ value }) => {
			setPending(true)
			signIn("password", { ...value, flow: "reset" })
				.then(() => {
					toast.success("Code was successfully sent!")
					setStep(value)
				})
				.catch(() => setError("Email doesn't exist"))
				.finally(() => setPending(false))
		}
	})

	return step === "forgot" ? (
		<Card className="w-full h-full p-8">
			<CardHeader className="px-0 pt-0">
				<CardTitle className="flex items-center">
					<Button
						variant="ghost"
						onClick={() => router.back()}
						disabled={pending}
						className="rounded-full mr-2 px-2"
					>
						<IoArrowBack size={24} />
					</Button>
					Reset your password
				</CardTitle >
				<CardDescription>
					You will receive the password reset code on your email
				</CardDescription>
			</CardHeader >
			{error && (
				<div className="bg-destructive/15 px-3 py-2.5 rounded flex items-center gap-x-2 text-sm text-destructive mb-4">
					<TriangleAlert size={20} />
					<p>{error}</p>
				</div>
			)}
			<CardContent className="space-y-5 px-0 pb-0">
				<form
					noValidate
					className="space-y-3"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handleSubmit();
					}}
				>
					<Field
						name="email"
						validators={{
							onSubmit: z
								.string()
								.min(1, "Email is required")
								.max(40, "Email must contain at most 40 characters")
								.email("Invalid email"),
						}}
					>
						{(field) => (
							<>
								<Input
									type="email"
									placeholder="Email"
									name={field.name}
									disabled={pending}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									required
									className={clsx(
										"focus-visible:ring-0 focus-visible:ring-offset-0",
										{
											"border-red-500 placeholder:text-red-500": field.state.meta.errors.length,
										}
									)}
								/>
								{field.state.meta.errors.length > 0 &&
									typeof field.state.meta.errors[0] ===
									"string" ? (
									<em className="text-red-500 text-sm">
										{field.state.meta.errors[0].split(", ")[0]}
									</em>
								) : null}
							</>
						)}
					</Field>
					<Subscribe
						selector={(state) => [
							state.canSubmit,
							state.isSubmitting,
						]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								className="w-full"
								size="lg"
								disabled={!canSubmit || pending}
							>
								{isSubmitting || pending ?
									<PulseLoader
										color="white"
										loading={pending}
										size={10}
										aria-label="Loading Spinner"
										data-testid="loader"
									/>
									:
									"Send code"
								}
							</Button>
						)}
					</Subscribe>
				</form>
			</CardContent>
		</Card >
	) : <CodeVerificationForm email={step.email} setStep={setStep} />
}