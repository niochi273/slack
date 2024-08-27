import {
	Card,
	CardHeader,
	CardDescription,
	CardContent,
	CardTitle
} from "@/components/ui/card";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useForm } from "@tanstack/react-form";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { SignInFlow } from "@/lib/types";
import { FC } from "react";
import { z } from "zod";
import clsx from "clsx";

interface SignUpCardProps {
	setState: (state: SignInFlow) => void
}

export const SignUpCard: FC<SignUpCardProps> = ({ setState }) => {
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			confirm_password: ""
		},
		validatorAdapter: zodValidator(),
		onSubmit: async ({ value }) => {
			console.log(value);
		},
	});

	return (
		<Card className="w-full h-full p-8">
			<CardHeader className="px-0 pt-0">
				<CardTitle>
					Sign up to continue
				</CardTitle>
				<CardDescription>
					Use your email or another service to continue
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-5 px-0 pb-0">
				<form
					className="space-y-2.5"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.Field
						name="email"
						validators={{
							onSubmit: z
								.string()
								.min(1, "Email is required")
								.email("Invalid email"),
						}}
					>
						{(field) => (
							<>
								<Input
									name={field.name}
									disabled={false}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Email"
									className={clsx(
										"focus-visible:ring-0 focus-visible:ring-offset-0",
										{
											"border-red-500": field.state.meta.errors.length,
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
					</form.Field>
					<form.Field
						name="password"
						validators={{
							onSubmit: z
								.string()
								.min(1, "Password is required")
								.min(5, "Password must contain at least 5 characters")
								.max(50, "Password must contain at most 50 characters")
								.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
								.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }),
						}}
					>
						{(field) => (
							<>
								<Input
									name={field.name}
									disabled={false}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									type="password"
									placeholder="Password"
									className={clsx(
										"focus-visible:ring-0 focus-visible:ring-offset-0",
										{
											"border-red-500": field.state.meta.errors.length,
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
					</form.Field>
					<form.Field
						name="confirm_password"
						validators={{
							onChangeListenTo: ['password'],
							onSubmit: ({ value, fieldApi }) => {
								if (!value) {
									return "Confirm password is required";
								}
								if (value !== fieldApi.form.getFieldValue("password")) {
									return "Passwords don't match";
								}
								return undefined;
							},
						}}
					>
						{(field) => (
							<>
								<Input
									name={field.name}
									disabled={false}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									type="password"
									placeholder="Confirm password"
									className={clsx(
										"focus-visible:ring-0 focus-visible:ring-offset-0",
										{
											"border-red-500": field.state.meta.errors.length,
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
					</form.Field>
					<form.Subscribe
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
								disabled={!canSubmit}
							>
								{isSubmitting ? "..." : "Continue"}
							</Button>
						)}
					</form.Subscribe>
				</form>
				<Separator />
				<div className="flex flex-col gap-y-2.5">
					<Button
						disabled={false}
						onClick={() => { }}
						variant="outline"
						size="lg"
						className="w-full"
					>
						<FcGoogle size={20} />
						<div className="ml-2">
							Continue with Google
						</div>
					</Button>
					<Button
						disabled={false}
						onClick={() => { }}
						variant="outline"
						size="lg"
						className="w-full"
					>
						<FaGithub size={20} />
						<div className="ml-2">
							Continue with Github
						</div>
					</Button>
				</div>
				<p className="text-sm text-muted-foreground text-center">
					Already have an account?
					<span
						onClick={() => setState("signIn")}
						className="text-sky-500 hover:underline cursor-pointer ml-2">
						Sign In
					</span>
				</p>
			</CardContent>
		</Card>
	);
};