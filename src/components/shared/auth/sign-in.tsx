'use client'

import {
	Card,
	CardHeader,
	CardDescription,
	CardContent,
	CardTitle,
	CardFooter
} from "@/components/ui/card";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, TriangleAlert } from "lucide-react"
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { z } from "zod";
import { PulseLoader } from "react-spinners";

export const SignInCard = () => {
	const [pending, setPending] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
	const passwordRef = useRef<HTMLInputElement | null>(null)

	const { signIn } = useAuthActions();
	const handleProviderSignIn = (provider: "github" | "google") => {
		setPending(true)
		signIn(provider, { redirectTo: "/" }).finally(() => setPending(false))
	}

	const { handleSubmit, Subscribe, Field } = useForm({
		validatorAdapter: zodValidator(),
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: ({ value }) => {
			const { email, password } = value
			setPending(true)
			setError("")

			signIn("password", { email, password, flow: "signIn", redirectTo: "/" })
				.catch(() => setError("Invalid email or password"))
				.finally(() => setPending(false))
		},
	});

	return (
		<Card className="w-full h-full p-8">
			<CardHeader className="px-0 pt-0">
				<CardTitle>Login to continue</CardTitle>
				<CardDescription>
					Use your email or another service to continue
				</CardDescription>
			</CardHeader>
			{error && (
				<div className="bg-destructive/15 p-3 rounded flex items-center gap-x-2 text-sm text-destructive mb-4">
					<TriangleAlert size={20} />
					<p>{error}</p>
				</div>
			)}
			<CardContent className="space-y-5 px-0 pb-0">
				<form
					noValidate
					className="space-y-2.5"
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
											"border-red-500 placeholder:text-red-500": field.state.meta.errorMap.onSubmit,
										}
									)}
								/>
								{field.state.meta.errorMap.onSubmit &&
									typeof field.state.meta.errorMap.onSubmit ===
									"string" ? (
									<em className="text-red-500 text-sm">
										{field.state.meta.errorMap.onSubmit.split(", ")[0]}
									</em>
								) : null}
							</>
						)}
					</Field>
					<Field
						name="password"
						validators={{
							onSubmit: z
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
							<>
								<div className="relative">
									<Input
										ref={passwordRef}
										type={isPasswordVisible ? "text" : "password"}
										placeholder="Password"
										name={field.name}
										disabled={pending}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										required
										className={clsx(
											"focus-visible:ring-0 focus-visible:ring-offset-0 pr-10",
											{
												"border-red-500 placeholder:text-red-500": field.state.meta.errors.length,
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
								</div>
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
									: "Sign In"}
							</Button>
						)}
					</Subscribe>
				</form>
				<div className="flex items-center text-muted-foreground gap-2">
					<div className="h-[1px] bg-border w-full"></div>
					Or
					<div className="h-[1px] bg-border w-full"></div>
				</div>
				<div className="flex flex-col gap-y-2.5">
					<Button
						disabled={pending}
						onClick={() => handleProviderSignIn('google')}
						variant="outline"
						size="lg"
						className="w-full"
					>
						<FcGoogle size={20} />
						<div className="ml-2">Continue with Google</div>
					</Button>
					<Button
						disabled={pending}
						onClick={() => handleProviderSignIn('github')}
						variant="outline"
						size="lg"
						className="w-full"
					>
						<FaGithub size={20} />
						<div className="ml-2">Continue with Github</div>
					</Button>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col mt-4 pb-0">
				<div className="text-sm text-muted-foreground text-center">
					Don&apos;t have an account?
					<Link
						href="/auth/signup"
						className="text-sky-500 hover:underline cursor-pointer ml-2"
					>
						Sign Up
					</Link>
				</div>
				<div className="text-center text-sm">
					<Link
						href="/auth/reset-password"
						className="text-sky-500 hover:underline cursor-pointer ml-2"
					>
						Forgot password
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
};
