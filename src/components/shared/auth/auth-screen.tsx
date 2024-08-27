"use client"

import { SignInFlow } from "@/lib/types"
import { useState } from "react"
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";

export const AuthScreen = () => {
	const [state, setState] = useState<SignInFlow>('signIn');

	return (
		<div className="h-full flex items-center justify-center bg-[#5C3B58]">
			<div className="w-[370px] md:w-[420px]">
				{state === 'signIn' ? <SignInCard setState={setState} /> : <SignUpCard setState={setState} />}
			</div>
		</div>
	)
}