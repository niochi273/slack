import {
	Card,
	CardHeader,
	CardDescription,
	CardContent,
	CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { SignInFlow } from "@/lib/types";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { FC } from "react";
import { z } from "zod";
import clsx from "clsx";

interface SignInCardProps {
	setState: (state: SignInFlow) => void;
}

export const SignInCard: FC<SignInCardProps> = ({ setState }) => {
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validatorAdapter: zodValidator(),
		onSubmit: async ({ value }) => {
			console.log(value);
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
								.max(40, "Password must contain at most 40 characters")
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
						<div className="ml-2">Continue with Google</div>
					</Button>
					<Button
						disabled={false}
						onClick={() => { }}
						variant="outline"
						size="lg"
						className="w-full"
					>
						<FaGithub size={20} />
						<div className="ml-2">Continue with Github</div>
					</Button>
				</div>
				<p className="text-sm text-muted-foreground text-center">
					Don&apos;t have an account?
					<span
						onClick={() => setState("signUp")}
						className="text-sky-500 hover:underline cursor-pointer ml-2"
					>
						Sign Up
					</span>
				</p>
			</CardContent>
		</Card>
	);
};
